import { cookies } from "next/headers";
import { getValidGoogleAccessToken } from "@/app/lib/google/token";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;


    if (!userId) {
      return Response.json({ items: [] });
    }

    const accessToken = await getValidGoogleAccessToken(userId);

    if (!accessToken) {
      return Response.json({ items: [] });
    }

    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events" +
        "?timeMin=" + new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString() +
        "&timeMax=" + new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59).toISOString(),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      console.error("Calendar API error", await res.text());
      return Response.json({ items: [] });
    }

    const data = await res.json();
   
    return Response.json(data);
    

  } catch (e) {
    console.error("calendar route error", e);
    return Response.json({ items: [] });
  }
}
