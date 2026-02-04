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
  wallpaperUrl: [string, string, string];
  newsList0: NewsItem[];
  newsList: NewsItem[];
  followDomainsList?: NewsItem[];
};

const MAX_FOLLOW = 5;

export default function NewsClient({ wallpaperUrl, newsList0, newsList, followDomainsList }: Props) {
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

  /* フォロー済みドメイン一覧 */
  const followedDomains = useMemo(
    () => new Set(followMedia.map((m) => m.domain)),
    [followMedia]
  );

  /* フォロー上限判定 */
  const isLimitReached = followMedia.length >= MAX_FOLLOW;

  /* フォロー処理 */
  const follow = async (item: FollowMediaItem) => {
    if (followedDomains.has(item.domain)) return;
    if (isLimitReached) return;

    const next = [...followMedia, item];

    /* 即UI反映（楽観更新） */
    setFollowMedia(next);

    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        followMedia: next,
      }),
    });

    /* 失敗時は元に戻す */
    if (!res.ok) {
      setFollowMedia(followMedia);
    }

    setSaving(false);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <div style={{ width: "695px", padding: "15px", height: "380px", margin: "15px 8px", border: "1px solid #808080", borderRadius: "30px", }}>
        <h1 style={{ marginBottom: "8px", fontSize: "22px" }}>トップニュース</h1>
        <div style={{ display: "flex"}}>
          <div>
            {newsList0.map((news) => {
              return (
                <div key={news.link + "TOP"} style={{ display: "flex", marginBottom: "3px", borderBottom: "1px solid #ccc", paddingBottom: "3px" }}>
                  <a href={news.link}>
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
                      <h2>{news.title.length > 25
                          ? news.title.slice(0, 24) + "..."
                          : news.title}
                      </h2>
                    </div>
                  </a>
                </div>
              )
            })}
          </div>
          <div>
            <a href={wallpaperUrl[1]} target="_blank" rel="noopener noreferrer">
              <img src={wallpaperUrl[0]} alt={wallpaperUrl[2]} style={{ width: "240px" }} />
              <p style={{ fontSize: "16px" }}>{wallpaperUrl[2]}</p>
            </a>
          </div>
        </div>
      </div>
      {newsList.map((news) => {
        const domain = new URL(news.link).hostname;
        const isFollowed = followedDomains.has(domain);
        const disabled = isFollowed || isLimitReached || saving;

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
              disabled={disabled}
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
                cursor: disabled ? "not-allowed" : "pointer",
                backgroundColor: isFollowed
                  ? "#aaa"
                  : isLimitReached
                  ? "#ddd"
                  : "#0070f3",
                color: isFollowed || isLimitReached ? "#555" : "#fff",
                fontSize: "13px",
              }}
            >
              {isFollowed
                ? "フォロー中"
                : isLimitReached
                ? "上限5件"
                : "フォロー"}
            </button>
          </div>
        );
      })}
      {followDomainsList?.map((news) => {
        return (
          <div
            key={news.link + "follow"}
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
          </div>
        );
      })}
    </div>
  );
}
