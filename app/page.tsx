import { NewsItem } from "./types";
import Image from "next/image";

export default async function Page() {
  const apiKey = process.env.NEWSDATA_API_KEY!;
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=那覇&country=jp&language=ja`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  const newsList: NewsItem[] = data.results || [];

  return (
    <main style={{ padding: "40px" }}>
      <h1 style={{fontSize: "40px"}}>最新ニュース</h1>

      {newsList.map((news) => (
        <div key={news.link} style={{padding: "20px 50px", margin: "15px"}}>
          <a href={news.link} style={{padding: "40px"}}>
          <img src={news.image_url} style={{width: "300px"}}/>
          <h2 style={{fontSize: "25px"}}>{news.title}</h2>
          <p>{news.description}...</p>
          </a>
        </div>
      ))}
    </main>
  );
}
