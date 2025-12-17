/* app/api/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code" },
      { status: 400 }
    );
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    return NextResponse.json(
      { error: "Failed to fetch token", detail: errorText },
      { status: 500 }
    );
  }

  const token = (await tokenRes.json()) as GoogleTokenResponse;

  // access_token が無い場合は即エラー
  if (!token.access_token) {
    return NextResponse.json(
      { error: "No access_token in response", token },
      { status: 500 }
    );
  }

  // cookie に保存（Server Component から参照可能）
  const store = await cookies();
  store.set("access_token", token.access_token, {
    httpOnly: true,
    path: "/",
  });

  // トップページへ戻す
  return NextResponse.redirect(new URL("/", req.url));
}
*/
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
      redirect_uri: '${process.env.GOOGLE_REDIRECT_URI}/api/callback',
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

