//import GeminiWeather from "../components/GeminiWeather";
import { NewsItem, forecastsItem } from "./types";

export default async function Page() {
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
      <h1 style={{ fontSize: "52px", fontWeight: "bold"}}>{mm}月{dd}日 </h1>
      <p style={{ fontSize: "20px" }}>{data2.anniv1}</p>

      <div style={{ marginRight: "550px", padding: "25px 25px", backgroundColor: "rgb(100 100 100 / 0.2)", borderRadius: "30px" }}>
        <p style={{ fontSize: "25px" }}>{data3.title}</p>

        <div style={{ display: "flex", gap: "20px" }}>
          {forecastsList.map((fore) => (
            <div key={fore.date} style={{ padding: "20px", margin: "15px", backgroundColor: "rgb(255 255 255)", borderRadius: "30px" }}>
              <h3 style={{fontSize: "25px"}}>{fore.dateLabel}</h3>
              <img src={fore.image.url} style={{ width: "80px" }} />
              <h2 style={{ fontSize: "25px" }}>{fore.telop}</h2>
              <div style={{display: "flex"}}>
                <p style={{margin: "5px 0", color: "red"}}>最高 {fore.temperature.max?.celsius ?? "-"}℃</p>
                <p style={{margin: "5px 20px", color: "blue"}}>最低 {fore.temperature.min?.celsius ?? "-"}℃</p>
              </div>
              <p style={{marginTop: "0px"}}>{fore.detail.wind}</p>
            </div>
          ))}
        </div>
      </div>


      {/* ▼ 天気（Gemini）をここに表示
      <h2 style={{ marginTop: 30 }}>明日の那覇の天気（Gemini）</h2>
      <GeminiWeather /> */}
      <div style={{clear: "both"}}>
        <h1 style={{ fontSize: "40px" }}>最新ニュース</h1>
        {newsList.map((news) => (
          <div key={news.link} style={{ padding: "20px 50px", margin: "15px" }}>
            <a href={news.link} style={{ padding: "40px" }}>
              <img src={news.image_url} style={{ width: "300px" }} />
              <h2 style={{ fontSize: "25px" }}>{news.title}</h2>
              <p>{news.description}...</p>
            </a>
          </div>
        ))}
      </div>  
    </main>
  );
}
