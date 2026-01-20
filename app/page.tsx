import { CalendarEvent } from "./types";
import { cookies } from "next/headers";
import { prisma } from "./lib/prisma";
import { redirect } from "next/navigation";
import MonthCalendar from "../components/MonthCalendar";
//import { getHolidays } from "./lib/getHolidays";
import GmailBadge from "@/components/GmailBadge";
import GeminiWeather from "@/components/GeminiWeather";
import News from "@/components/News";
import Weather from "@/components/Weather"

export const dynamic = "force-dynamic";

export default async function Page() {
  const store = await cookies();
  //const token = store.get("access_token")?.value;
  const userId = store.get("user_id")?.value;

  if (!userId) {
    return (
      <main style={{textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh"}}>
        <div>
          <h1 style={{ fontSize: "40px", fontWeight: "bold", textAlign: "center" }}>ようこそ</h1>
          <p style={{ margin: "15px 0 45px", fontSize: "15px", textAlign: "center" }}>利用するにはGoogleでログインしてください</p>
          <a href="/api/auth" style={{ padding: "13px", fontSize: "20px", border: "1px solid", borderRadius: "24px", backgroundColor: "#1e90ff", color: "#ffffff", fontWeight: "bold" }}>ログイン</a>
        </div>
      </main>
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });




  /*const resMail = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gmail`,
    { cache: "no-store" }
  );*/

  //const mail = await resMail.json();


/*const resG = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      headers: {
        Authorization: `Bearer ${userId}`,
      },
      cache: "no-store",
    }
  );*/

  // 🔴 token失効対策
  /*if (resG.status === 401) {
    redirect("/api/logout");
  }

  const dataG: { items?: CalendarEvent[] } = await resG.json();*/

  //const holidays = await getHolidays();




  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const mmdd = mm + dd;

  const url2 = `https://api.whatistoday.cyou/v3/anniv/${mmdd}`;
  const res2 = await fetch(url2, { cache: "no-cache" });
  const data2 = await res2.json();


  return (
    <main style={{ padding: "12px 30px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1 style={{ marginBottom: "-5px", fontSize: "52px", fontWeight: "bold"}}>{mm}月{dd}日 </h1>
        <a href="https://accounts.google.com/ServiceLogin?hl=ja&service=mail" style={{ display: "flex", gap: 8, alignItems: "center", margin: "0 0 0 auto" }}>
          <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEBDW70SmITUhm0ZSKCwMQgwtW37FXcQaw-g&s"} alt={"mail icon"} style={{ width: "35px", height: "35px", paddingRight: "-10px"}} />
          <GmailBadge />
        </a>
      </div>
      <p style={{marginBottom: "18px", fontSize: "20px" }}>{data2.anniv1}</p>


      {user?.settings?.showWeather && (<Weather /> )}

      
      {user?.settings?.showCalendar && (<MonthCalendar
      events={[]}
      /> )}


      {/* ▼ Gemini をここに表示  */}
      <h2 style={{ marginTop: "40px", fontSize: "40px" }}>Geminiのおすすめの服装</h2>
      <GeminiWeather />

      {user?.settings?.showNews && (<News text="那覇"/> )}

      
    </main>
  );
}
