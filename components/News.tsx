import { NewsItem } from "../app/types";
import NewsImage from "./NewsImage";

async function newsda ({text}: {text: string}) {
  const apiKey = process.env.NEWSDATA_API_KEY!;
      const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${text}&country=jp&language=ja&removeduplicate=1`;
    
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      const newsList: NewsItem[] = data.results || [];
      return newsList;
}


export default async function Page() {
  const newsList = await newsda({text: "那覇"});
  const newsList2 = await newsda({text: "アニメ"});
  const newsList3 = [...newsList, ...newsList2];

    return (
        <div style={{marginTop: "18px", clear: "both"}}>
        <h1 style={{ fontSize: "40px" }}>最新ニュース</h1>
        <div style={{ display: "flex", flexWrap: "wrap"}}>
          {newsList3.map((news) => (
            <div key={news.link} style={{ margin: "15px 8px", width: "339.5px", height: "350px", border: "1px solid #808080", borderRadius: "30px" }}>
              <a href={news.link} style={{ padding: "0px" }}>
                <NewsImage src={news?.image_url} alt={news?.title} />
                <div style={{ margin: "15px 18px 0"}}>
                  <div style={{ display: "flex" }}>
                    <img src={news?.source_icon ?? ""} alt={"？"} style={{ marginRight: "5px", width: "23px", height: "23px"}} />
                    <p style={{ fontSize: "16px"}}>{news.source_name}</p>
                  </div>
                  <h2 style={{ marginTop: "5px", fontSize: "18px", fontWeight: "bold" }}>{news.title.slice(0, 35) !== news.title ? news.title.slice(0, 34) + "..." : news.title}</h2>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div> 
    )
}