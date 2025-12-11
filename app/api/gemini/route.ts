import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json({ ok: true });
}

/*export async function POST(req: Request) {
  const { query } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY!;
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" +
    apiKey;

  const body = {
    contents: [
      {
        parts: [{ text: query }],
      },
    ],
  };

  let res;

  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return Response.json({ answer: "通信エラー" });
  }

  if (res.status === 429) {
    return Response.json({ answer: "Gemini: quota exceeded (429)" });
  }

  const json = await res.json();

  if (json.error) {
    return Response.json({ answer: `ERROR: ${json.error.message}` });
  }

  const answer =
    json.candidates?.[0]?.content?.parts?.[0]?.text ??
    "応答がありません";

  return Response.json({ answer });
}
*/