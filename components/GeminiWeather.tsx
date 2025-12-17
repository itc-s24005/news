"use client";
import { useEffect, useState } from "react";

export default function GeminiWeather() {
  const [text, setText] = useState("天気取得中...");

  useEffect(() => {
    async function run() {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "明日の那覇の天気を短く教えてください。",
        }),
      });

      const data = await res.json();

      // ★ 全パターン対応パーサー（const に変更）
      const answer =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.content?.parts?.[0]?.content ||
        data?.candidates?.[0]?.content?.text ||
        data?.text ||
        JSON.stringify(data);

      setText(answer);
    }

    run();
  }, []);

  return <p style={{ fontSize: 20, marginTop: 10 }}>{text}</p>;
}
