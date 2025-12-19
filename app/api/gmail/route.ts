import { cookies } from "next/headers";

export async function GET() {
  const store = await cookies();
  const token = store.get("access_token")?.value;

  if (!token) {
    return Response.json({ error: "No token" }, { status: 401 });
  }

  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/labels/UNREAD",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const json = await res.json();

  return Response.json({
    unreadCount: json.messagesUnread ?? 0,
  });
}
