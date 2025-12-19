"use client";

import { useEffect, useState } from "react";

export default function GmailBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gmail", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setCount(data.unreadCount))
      .catch(() => setCount(null));
  }, []);

  if (count === null || count === 0) return null;

  return (
    <div
      style={{
        background: "red",
        color: "white",
        borderRadius: "50%",
        minWidth: 20,
        height: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: "bold",
        marginTop: "-22px",
        marginLeft: "-20px",
        padding: "0 5px",
      }}
    >
      {count >= 100 ? "99+" : count}
    </div>
  );
}
