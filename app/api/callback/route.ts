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
  console.log("OAUTH SCOPE", token.scope);

  if (!token.access_token) {
    console.error("❌ NO ACCESS TOKEN", token);
    return Response.json(token, { status: 500 });
  }

  const cookieStore = await cookies();

  cookieStore.set("access_token", token.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });


  return Response.redirect(new URL("/", req.url));
}

