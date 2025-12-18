// app/api/callback/route.ts

/*
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return Response.json({ error: "No code" }, { status: 400 });
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.GOOGLE_REDIRECT_URI}/api/callback`,
      grant_type: "authorization_code",
    }),
  });

  const token = await tokenRes.json();

  if (!token.access_token) {
    return Response.json(token, { status: 500 });
  }

  const store = await cookies();

  store.set("access_token", token.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1時間
  });

  if (token.refresh_token) {
    store.set("refresh_token", token.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return Response.redirect(process.env.GOOGLE_REDIRECT_URI!);
}
*/
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return Response.json({ error: "No code" }, { status: 400 });
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`,
      grant_type: "authorization_code",
    }),
  });

  const token = await tokenRes.json();

  if (!token.access_token) {
    console.error("❌ NO ACCESS TOKEN", token);
    return Response.json(token, { status: 500 });
  }

  const cookieStore = await cookies();

  cookieStore.set("access_token", token.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",              // ← これ重要
  });

  return Response.redirect(new URL("/", req.url));
}

