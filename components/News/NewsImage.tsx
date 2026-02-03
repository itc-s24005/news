"use client";

import { useEffect, useState } from "react";

type Props = {
  src?: string;
  alt?: string;
};

export default function NewsImage({ src, alt }: Props) {
  const fallback = "/news.jpg";

  // 初期値で fallback を入れる（ここ重要）
  const [imgSrc, setImgSrc] = useState(fallback);

  useEffect(() => {
    if (!src) return; // setStateしない

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImgSrc(src);
    };

    img.onerror = () => {
      setImgSrc(fallback);
    };
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt ?? "news image"}
      style={{
        width: "360px",
        height: "180px",
        objectFit: "cover",
        borderRadius: "29px 29px 0 0",
      }}
    />
  );
}
