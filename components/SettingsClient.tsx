"use client";

import { useEffect, useState } from "react";

/* =========================
 * 型定義
 * ========================= */
type Settings = {
  showWeather: boolean;
  showCalendar: boolean;
  showNews: boolean;
  observationLocation: [string, string];
};

type LocationList = {
  [pref: string]: {
    [area: string]: string; // 数字キーは無視する
  };
};

/* =========================
 * Component
 * ========================= */
export default function SettingsClient() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [locations, setLocations] = useState<LocationList>({});
  const [saving, setSaving] = useState(false);

  /* =========================
   * 設定取得
   * ========================= */
  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    };

    fetchSettings();
  }, []);

  /* =========================
   * 観測地点リスト取得
   * ========================= */
  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetch("/list.json");
      const data = await res.json();
      setLocations(data);
    };

    fetchLocations();
  }, []);

  /* =========================
   * 更新処理
   * ========================= */
  const saveSettings = async () => {
    if (!settings) return;

    setSaving(true);

    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    alert("設定を保存しました");
  };

  if (!settings) {
    return <div>読み込み中...</div>;
  }

  const [pref, area] = settings.observationLocation;

  return (
    <div style={{ maxWidth: 480 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>ページ設定</h2>

      {/* =========================
       * 表示設定
       * ========================= */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, marginBottom: 8 }}>表示設定</h3>

        <label>
          <input
            type="checkbox"
            checked={settings.showWeather}
            onChange={(e) =>
              setSettings({ ...settings, showWeather: e.target.checked })
            }
          />{" "}
          天気を表示
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            checked={settings.showCalendar}
            onChange={(e) =>
              setSettings({ ...settings, showCalendar: e.target.checked })
            }
          />{" "}
          カレンダーを表示
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            checked={settings.showNews}
            onChange={(e) =>
              setSettings({ ...settings, showNews: e.target.checked })
            }
          />{" "}
          ニュースを表示
        </label>
      </section>

      {/* =========================
       * 観測地点設定
       * ========================= */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, marginBottom: 8 }}>天気の観測地点</h3>

        {/* 都道府県 */}
        <select
          value={pref}
          onChange={(e) => {
            const newPref = e.target.value;
            const firstArea =
              Object.keys(locations[newPref] || {})[0] ?? "";
            setSettings({
              ...settings,
              observationLocation: [newPref, firstArea],
            });
          }}
        >
          {Object.keys(locations).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* 地域 */}
        <select
          value={area}
          onChange={(e) =>
            setSettings({
              ...settings,
              observationLocation: [pref, e.target.value],
            })
          }
          style={{ marginLeft: 8 }}
        >
          {locations[pref] &&
            Object.keys(locations[pref])
              .filter((key) => isNaN(Number(key))) // 数字キー除外
              .map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
        </select>
      </section>

      {/* =========================
       * 保存
       * ========================= */}
      <button onClick={saveSettings} disabled={saving}>
        {saving ? "保存中..." : "保存する"}
      </button>
    </div>
  );
}
