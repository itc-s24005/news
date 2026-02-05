import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { forecastsItem, KansokuID } from "../app/types";
import kansokuIDsData from "@/public/list.json";

export default async function Weather() {
  const Idlist = kansokuIDsData as KansokuID;

  /* cookie から userId 取得 */
  const store = await cookies();
  const userId = store.get("user_id")?.value;

  /* 観測地デフォルト */
  let pref = "東京都";
  let area = "東京";

  if (userId) {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
      select: { observationLocation: true },
    });

    if (
      settings?.observationLocation &&
      Array.isArray(settings.observationLocation) &&
      settings.observationLocation.length > 0
    ) {
      const [p, a] = settings.observationLocation[0] as [string, string];
      pref = p;
      area = a;
    }
  }

  /* 観測ID取得 */
  const cityCode = Idlist[pref]?.[area];

  if (!cityCode) {
    return <div>観測地が見つかりません</div>;
  }

  /* 天気API */
  const url = `https://weather.tsukumijima.net/api/forecast/city/${cityCode}`;
  const res = await fetch(url, { cache: "no-cache" });
  const data = await res.json();

  const forecastsList: forecastsItem[] = data.forecasts || [];
  let imageUrl: string = "/1718.jpg";



  const now = forecastsList[0].telop;
  if (now.slice(0, 1).includes("晴")) {
    imageUrl = "/1718.jpg";
  } else if (now.slice(0, 1).includes("曇")) {
    imageUrl = "/1456.jpg";
  } else if (now.slice(0, 1).includes("雨")) {
    imageUrl = "/113.jpg";
  } else if (now.slice(0, 1).includes("雪")) {
    imageUrl = "/14808.jpg";
  }





  return (
  <div
    style={{
      minWidth: "1779px",
      marginTop: "25px",
      marginRight: "500px",
      padding: "25px 25px",
      borderRadius: "30px",
      position: "relative", // 子要素の絶対配置の基準にする
      overflow: "hidden",    // 背景レイヤーが角丸からはみ出ないようにする
      backgroundColor: "rgb(100 100 100 / 0.2)", // 画像読み込み前の予備色
    }}
  >
    {/* --- 背景画像専用レイヤー --- */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.83)", // ここで画像だけを暗くする
        zIndex: 0,                  // 背面に配置
      }}
    />

    {/* --- コンテンツレイヤー（文字やカード） --- */}
    <div style={{ position: "relative", zIndex: 1 }}>
      <p style={{ 
        fontSize: "25px", 
        color: "#fff", 
        textShadow: "0 2px 4px rgba(0,0,0,0.5)" 
      }}>
        {data.title}
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
        {forecastsList.map((fore) => (
          <div
            key={fore.date}
            style={{
              padding: "17px",
              margin: "15px",
              width: "400px",
              backgroundColor: "rgba(255, 255, 255, 0.9)", // カードを少し透かすとおしゃれ
              borderRadius: "30px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: "22px" }}>{fore.dateLabel}</h3>
            {/* ...以下、既存のカード内コンテンツ... */}
            <div style={{ display: "flex" }}>
              <img src={fore.image.url} alt={fore.image.alt} style={{ width: "85px", marginRight: "10px" }} />
              <div>
                <h2 style={{ marginBottom: "-5px", fontSize: "28px" }}>{fore.telop}</h2>
                <div style={{ display: "flex" }}>
                  <p style={{ margin: "5px 0", color: "red" }}>最高 {fore.temperature.max?.celsius ?? "-"}℃</p>
                  <p style={{ margin: "5px 20px", color: "blue" }}>最低 {fore.temperature.min?.celsius ?? "-"}℃</p>
                </div>
              </div>
            </div>
            <p style={{ marginTop: "0px" }}>{fore.detail.weather}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}
