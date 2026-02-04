import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { FollowMediaItem } from "@/app/types";
import { getBingWallpaper } from "@/app/types/bing";
import NewsClient from "./NewsClient";

async function newsio({ text }: { text?: string } = {}, { category }: { category?: string } = {}, { domain }: { domain?: string } = {}) {
  const apiKey = process.env.NEWSDATA_API_KEY!;
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}${text}&country=jp&language=ja&removeduplicate=1${category}${domain}&excludefield=ai_summary,ai_org,ai_region,sentiment_stats,sentiment,ai_tag,creator,keywords,source_priority,source_id,video_url,content,source_url,pubdate,pubdatetz`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  return data.results || [];
}

export default async function NewsWidget() {
  const wallpaper = await getBingWallpaper();
  const wallpaperUrl = [wallpaper.url, wallpaper.copyrightlink, wallpaper.title] as [string, string, string];
  /* cookie から userId 取得 */
  const store = await cookies();
  const userId = store.get("user_id")?.value;

  /* settings 初期値 */
  let followDomains: string[] = [];
  let observationLocation: [string, string][] = [];

  if (userId) {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
      select: {
        followMedia: true,
        observationLocation: true,
      },
    });

    if (settings) {
      /* followMedia → domain 配列に変換 */
      followDomains = (settings.followMedia as FollowMediaItem[] ?? []).map(
        (m) => m.domain
      );

      /* 観測地 */
      observationLocation =
        (settings.observationLocation as [string, string][]) ?? [];
    }
  }

  /* ニュース取得（例：観測地を使うことも可能） */
  const news0 = await newsio({ text: "" }, { category: "&category=top"}, { domain: "" });
  const news1 = await newsio({ text: "&q=那覇" }, { category: ""}, { domain: "" });
  //const news2 = await newsio({ text: "&q=アニメ" }, { category: ""},  { domain: "" });
  //const y = await Promise.all(followDomains.map((d) => newsio({ text: "" }, { category: ""},  { domain: `&domainurl=${d}` })));
  const newsList = [...news1];

  return (
    <div style={{ marginTop: "18px", clear: "both" }}>
      <h1 style={{ fontSize: "40px" }}>最新ニュース</h1>

      <NewsClient 
        wallpaperUrl={wallpaperUrl}
        newsList0={news0}
        newsList={newsList}
      />
    </div>
  );
}
