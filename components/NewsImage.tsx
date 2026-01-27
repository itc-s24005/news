"use client";

type Props = {
  src?: string;
  alt?: string;
};

export default function NewsImage({ src, alt }: Props) {
  const fallback = "/news.jpg";

  return (
    <img
      src={src || fallback}
      alt={alt ?? "news image"}
      onError={(e) => {
        if (e.currentTarget.src.endsWith(fallback)) return;
        e.currentTarget.src = fallback;
      }}
      style={{
        width: "360px",
        height: "180px",
        objectFit: "cover",
        borderRadius: "29px 29px 0 0",
      }}
    />
  );
}
