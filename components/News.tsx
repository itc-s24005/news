import { NewsItem } from "../app/types";
import NewsImage from "./NewsImage";
type Props = {
  text: string;
}

export default async function Page({text}: Props) {
    const apiKey = process.env.NEWSDATA_API_KEY!;
      const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${text}&country=jp&language=ja`;
    
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      const newsList: NewsItem[] = data.results || [];

    return (
        <div style={{marginTop: "18px", clear: "both"}}>
        <h1 style={{ fontSize: "40px" }}>最新ニュース</h1>
        <div>
          {newsList.map((news) => (
            <div key={news.link} style={{ margin: "15px", width: "360px", height: "350px", border: "1px solid #808080", borderRadius: "30px" }}>
              <a href={news.link} style={{ padding: "0px" }}>
                <NewsImage src={news?.image_url} alt={news?.title} />
                <div style={{ margin: "15px 18px 0"}}>
                  <div style={{ display: "flex" }}>
                    <img src={news?.source_icon ?? ""} alt={"？"} style={{ marginRight: "5px", width: "23px", height: "23px"}} />
                    <p style={{ fontSize: "16px"}}>{news.source_name}</p>
                  </div>
                  <h2 style={news.image_url ? { marginTop: "5px", fontSize: "18px", fontWeight: "bold" } : { marginTop: "5px", fontSize: "18px", fontWeight: "bold", display: "none" }}>{news.title}</h2>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div> 
    )
}