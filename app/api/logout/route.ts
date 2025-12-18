import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const store = await cookies();
  store.delete("access_token");
  store.delete("refresh_token");
  return NextResponse.redirect("/");
}
