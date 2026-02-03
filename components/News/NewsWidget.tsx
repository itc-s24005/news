import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { FollowMediaItem } from "@/app/types";
import NewsClient from "./NewsClient";

async function newsda({ text }: { text: string }, { domain }: { domain?: string } = {}) {
  const apiKey = process.env.NEWSDATA_API_KEY!;
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}${text}&country=jp&language=ja&removeduplicate=1${domain}&excludefield=ai_summary,ai_org,ai_region,sentiment_stats,sentiment,ai_tag,creator,keywords,source_priority,source_id,video_url,content,source_url,pubdate,pubdatetz`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  return data.results || [];
}

export default async function NewsWidget() {
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
  const news1 = await newsda({ text: "&q=那覇" }, { domain: "" });
  const news2 = await newsda({ text: "&q=アニメ" }, { domain: "" });
  const news3 = await newsda({ text: "" }, { domain: `&domainurl=${followDomains.join(",")}` });
  const newsList = [...news1, ...news2];

  return (
    <div style={{ marginTop: "18px", clear: "both" }}>
      <h1 style={{ fontSize: "40px" }}>最新ニュース</h1>

      <NewsClient
        newsList={newsList}
      />
    </div>
  );
}
