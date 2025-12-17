import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    //redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    redirect_uri: `${process.env.GOOGLE_REDIRECT_URI}/api/callback`,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    access_type: "offline",
    prompt: "consent",
  });
  console.log("CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
  console.log("REDIRECT_URI", `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`);


  return NextResponse.redirect(
    "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString()
  );
}
