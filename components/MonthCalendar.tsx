import { CalendarEvent } from "../app/types";

type Props = {
  holidays: Record<string, string>;
  events: CalendarEvent[];
};

/* ---------- Date → YYYY-MM-DD ---------- */
function toDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function MonthCalendar({ holidays, events }: Props) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekday = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  /* ---------- 日付 → 予定あり map ---------- */
  const hasEventMap: Record<string, boolean> = {};

  for (const e of events) {
    // 終日予定（複数日対応）
    if (e.start?.date && e.end?.date) {
      const cur = new Date(e.start.date + "T00:00:00");
      const end = new Date(e.end.date + "T00:00:00");

      while (cur < end) {
        hasEventMap[toDateKey(cur)] = true;
        cur.setDate(cur.getDate() + 1);
      }
      continue;
    }

    // 通常予定（dateTime）
    if (e.start?.dateTime) {
      const d = new Date(e.start.dateTime);
      hasEventMap[toDateKey(d)] = true;
    }
  }

  /* ---------- カレンダー配列 ---------- */
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <h2 style={{ fontSize: 35, marginBottom: 10 }}>
        {year}年 {month + 1}月
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
        }}
      >
        {/* 曜日ヘッダ */}
        {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: i === 0 ? "red" : i === 6 ? "blue" : "black",
            }}
          >
            {d}
          </div>
        ))}

        {/* 日付セル */}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

          const weekday = new Date(year, month, day).getDay();
          const holidayName = holidays[dateKey];

          const isSunday = weekday === 0;
          const isSaturday = weekday === 6;
          const isHoliday = Boolean(holidayName);
          const isToday =
            day === today.getDate() && month === today.getMonth();

          let color = "black";
          if (isSunday || isHoliday) color = "red";
          else if (isSaturday) color = "blue";

          return (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                minHeight: 100,
                padding: 4,
                background: isToday ? "#e3f2fd" : "white",
              }}
            >
              <div style={{ color, fontWeight: "bold" }}>{day}</div>

              {holidayName && (
                <div style={{ color: "red", fontSize: 12 }}>
                  🎌 {holidayName}
                </div>
              )}

              {/* 🔴 予定ありマーク */}
              {hasEventMap[dateKey] && (
                <div
                  style={{
                    marginTop: 6,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "red",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
