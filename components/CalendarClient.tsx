"use client";

import { useEffect, useState } from "react";
import MonthCalendar from "./MonthCalendar";
import { getHolidays } from "@/app/lib/getHolidays";

export type Event = {
  date: string;
  title: string;
  startTime?: string;
  endTime?: string;
  range?: {
    start: string;
    end: string;
  };
};


type CalendarApiEvent = {
  summary?: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
};

export default function CalendarClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [holidays, setHolidays] = useState<Record<string, string>>({});

  useEffect(() => {
  const fetchEvents = async () => {
    const res = await fetch("/api/calendar");
    const data = await res.json();

    const mapped: Event[] = [];

    (data.items ?? []).forEach((e: CalendarApiEvent) => {
    const startRaw = e.start.dateTime ?? e.start.date;
    const endRaw = e.end.dateTime ?? e.end.date;
    if (!startRaw || !endRaw) return;

    const isAllDay = !!e.start.date && !e.start.dateTime;

    const startDate = startRaw.slice(0, 10);
    let endDate = endRaw.slice(0, 10);

    // 🔴 終日イベントは end を1日戻す
    if (isAllDay) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - 1);
      endDate = d.toISOString().slice(0, 10);
    }

    const startTime = e.start.dateTime
      ? e.start.dateTime.slice(11, 16)
      : undefined;

    const endTime = e.end.dateTime
      ? e.end.dateTime.slice(11, 16)
      : undefined;

    const hasRange = startDate !== endDate;

    const cur = new Date(startDate);
    const end = new Date(endDate);

    while (cur <= end) {
      mapped.push({
        date: cur.toISOString().slice(0, 10),
        title: e.summary ?? "予定",
        startTime,
        endTime,
        range: hasRange
          ? { start: startDate, end: endDate }
          : undefined, // ← 1日のみなら range を持たせない
      });
      cur.setDate(cur.getDate() + 1);
    }
  });
    setEvents(mapped);

  };

  fetchEvents();
}, []);


  useEffect(() => {
    getHolidays().then(setHolidays);
  }, []);


  return <MonthCalendar events={events} holidays={holidays} />;
}