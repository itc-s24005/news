import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const store = await cookies();
  store.delete("access_token");

  return NextResponse.redirect(new URL("/api/auth", process.env.NEXT_PUBLIC_BASE_URL));
}
