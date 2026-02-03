"use client";

import { useEffect, useMemo, useState } from "react";
import { NewsItem } from "../../app/types";
import NewsImage from "./NewsImage";

type FollowMediaItem = {
  name: string;
  domain: string;
  icon: string;
};

type Props = {
  newsList: NewsItem[];
};

export default function NewsClient({ newsList }: Props) {
  const [followMedia, setFollowMedia] = useState<FollowMediaItem[]>([]);
  const [saving, setSaving] = useState(false);

  /* 初期フォロー状態取得 */
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setFollowMedia(data.followMedia ?? []);
      });
  }, []);

  /* フォロー済み判定 */
  const followedDomains = useMemo(
    () => new Set(followMedia.map((m) => m.domain)),
    [followMedia]
  );

  /* フォロー処理 */
  const follow = async (item: FollowMediaItem) => {
    if (followedDomains.has(item.domain)) return;

    const next = [...followMedia, item];
    setFollowMedia(next); // ← 即UI反映（楽観更新）

    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      body: JSON.stringify({
        followMedia: next,
      }),
    });
    setSaving(false);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {newsList.map((news) => {
        const domain = new URL(news.link).hostname;
        const isFollowed = followedDomains.has(domain);

        return (
          <div
            key={news.link}
            style={{
              margin: "15px 8px",
              width: "339.5px",
              height: "380px",
              border: "1px solid #808080",
              borderRadius: "30px",
              position: "relative",
            }}
          >
            <a href={news.link}>
              <NewsImage src={news.image_url} alt={news.title} />
              <div style={{ margin: "15px 18px 0" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={news.source_icon ?? ""}
                    alt=""
                    style={{
                      marginRight: "5px",
                      width: "23px",
                      height: "23px",
                    }}
                  />
                  <p style={{ fontSize: "16px" }}>{news.source_name}</p>
                </div>

                <h2
                  style={{
                    marginTop: "5px",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {news.title.length > 35
                    ? news.title.slice(0, 34) + "..."
                    : news.title}
                </h2>
              </div>
            </a>

            {/* フォローボタン */}
            <button
              disabled={isFollowed || saving}
              onClick={() =>
                follow({
                  name: news.source_name,
                  domain,
                  icon: news.source_icon ?? "",
                })
              }
              style={{
                position: "absolute",
                bottom: "14px",
                right: "16px",
                padding: "6px 12px",
                borderRadius: "16px",
                border: "none",
                cursor: isFollowed ? "default" : "pointer",
                background: isFollowed ? "#ccc" : "#0070f3",
                color: "#fff",
                fontSize: "13px",
              }}
            >
              {isFollowed ? "フォロー中" : "フォロー"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
