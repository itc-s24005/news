//import GeminiWeather from "../components/GeminiWeather";
import { NewsItem, forecastsItem, CalendarEvent } from "./types";
import { cookies } from "next/headers";
import MonthCalendar from "../components/MonthCalendar";

export const dynamic = "force-dynamic";

export default async function Page() {

  const store = await cookies();
  const token = store.get("access_token")?.value;

  if (!token) {
    return (
      <main style={{textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh"}}>
        <div>
          <h1 style={{ fontSize: "40px", fontWeight: "bold", textAlign: "center" }}>ようこそ</h1>
          <p style={{ margin: "15px 0 45px", fontSize: "15px", textAlign: "center" }}>利用するにはGoogleでログインしてください</p>
          <a href="/api/auth" style={{ padding: "13px", fontSize: "20px", border: "1px solid", borderRadius: "24px", backgroundColor: "#1e90ff", color: "#ffffff", fontWeight: "bold" }}>ログイン</a>
        </div>
      </main>
    )
  }

  const now = new Date();
const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

const urlG =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events?" +
  new URLSearchParams({
    timeMin: start,
    timeMax: end,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "2500",
  });

const resG = await fetch(urlG, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  cache: "no-store",
});

const dataG: { items?: CalendarEvent[] } = await resG.json();

console.log("EVENT ITEMS", dataG.items);
console.log("EVENT COUNT", dataG.items?.length);

  const year = new Date().getFullYear();
  const resS = await fetch(
    "https://holidays-jp.github.io/api/v1/date.json",
    { cache: "force-cache" }
  );

  const holidays: Record<string, string> = await resS.json();
  console.log(
  "EVENT DATES",
  (dataG.items ?? []).map(e =>
    e.start?.dateTime ?? e.start?.date
  )
);



console.log("EVENT ITEMS", dataG.items);

  const apiKey = process.env.NEWSDATA_API_KEY!;
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=那覇&country=jp&language=ja`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  const newsList: NewsItem[] = data.results || [];

  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const mmdd = mm + dd;

  const url2 = `https://api.whatistoday.cyou/v3/anniv/${mmdd}`;
  const res2 = await fetch(url2, { cache: "no-cache" });
  const data2 = await res2.json();

  const url3 = 'https://weather.tsukumijima.net/api/forecast/city/471010';
  const res3 = await fetch( url3, {cache: "no-cache" });
  const data3 = await res3.json();
  const forecastsList: forecastsItem[] = data3.forecasts || [];

  return (
    <main style={{ padding: "12px 30px" }}>
      <h1 style={{ marginBottom: "-5px", fontSize: "52px", fontWeight: "bold"}}>{mm}月{dd}日 </h1>
      <p style={{marginBottom: "18px", fontSize: "20px" }}>{data2.anniv1}</p>

      <div style={{ marginRight: "500px", padding: "25px 25px", backgroundColor: "rgb(100 100 100 / 0.2)", borderRadius: "30px" }}>
        <p style={{ fontSize: "25px" }}>{data3.title}</p>

        <div style={{ display: "flex", gap: "20px" }}>
          {forecastsList.map((fore) => (
            <div key={fore.date} style={{ padding: "17px", margin: "15px", width: "400px", backgroundColor: "rgb(255 255 255)", borderRadius: "30px" }}>
              <h3 style={{fontSize: "22px"}}>{fore.dateLabel}</h3>
              <div style={{display: "flex"}}>
                <img src={fore.image.url} style={{ width: "85px", marginRight: "10px" }} />
                <div>
                  <h2 style={{ marginBottom: "-5px", fontSize: "28px" }}>{fore.telop}</h2>
                  <div style={{display: "flex"}}>
                    <p style={{margin: "5px 0", color: "red"}}>最高 {fore.temperature.max?.celsius ?? "-"}℃</p>
                    <p style={{margin: "5px 20px", color: "blue"}}>最低 {fore.temperature.min?.celsius ?? "-"}℃</p>
                  </div>
                </div>
              </div>
              <p style={{marginTop: "0px"}}>{fore.detail.weather}</p>
            </div>
          ))}
        </div>
      </div>


    

      <MonthCalendar
        holidays={holidays}
        events={dataG.items ?? []}
      />



      {/* ▼ 天気（Gemini）をここに表示 
      <h2 style={{ marginTop: 30 }}>明日の那覇の天気（Gemini）</h2>
      <GeminiWeather /> */}
      <div style={{marginTop: "18px", clear: "both"}}>
        <h1 style={{ fontSize: "40px" }}>最新ニュース</h1>
        <div>
          {newsList.map((news) => (
            <div key={news.link} style={{ margin: "15px", width: "460px", height: "450px", border: "1px solid #808080", borderRadius: "30px" }}>
              <a href={news.link} style={{ padding: "0px" }}>
                <img src={news?.image_url ?? "https://thumb.photo-ac.com/b3/b3765dea160813920d23ea43b2e1e582_t.jpeg"} style={{ width: "460px", height: "280px", objectFit: "cover", borderRadius: "29px 29px 0 0" }} />
                <div style={{ margin: "15px 18px 0"}}>
                  <div style={{ display: "flex" }}>
                    <img src={news.source_icon} style={{ marginRight: "5px", width: "23px", height: "23px"}} />
                    <p style={{ fontSize: "16px"}}>{news.source_name}</p>
                  </div>
                  <h2 style={{ marginTop: "5px", fontSize: "22px", fontWeight: "bold" }}>{news.title}</h2>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>  
    </main>
  );
}
