import { cookies } from "next/headers";
import { prisma } from "./lib/prisma";
import CalendarClient from "@/components/CalendarClient";
import GmailBadge from "@/components/GmailBadge";
import News from "@/components/News";
import Weather from "@/components/Weather"
import Popover from "@/components/Popover";
import Image from 'next/image';
import { getBingWallpaper } from "./types/bing";
//import { FollowMedia } from "@/app/types";

export const dynamic = "force-dynamic";
export default async function Page() {
  const wallpaper = await getBingWallpaper();

  const store = await cookies();
  const userId = store.get("user_id")?.value;

  if (!userId || (await prisma.user.findUnique({ where: { id: userId } })) === null) {
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

  //const locations = user?.settings?.observationLocation as string[];
  //const media = user?.settings?.followMedia as FollowMedia[];
console.log(user?.settings?.observationLocation);
console.log(user?.settings?.followMedia);

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
    <main>
      <img
        src={wallpaper.url}
        alt={wallpaper.title}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          objectFit: "cover",
          filter: "brightness(0.85)"
        }}
      />
      <div style={{ backgroundImage: "linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.62) 85%)", display: "flex", alignItems: "center", marginBottom: "450px", padding: "0 30px" }}>
        <div>
          <h1 style={{ marginBottom: "-5px", fontSize: "40px", fontWeight: "bold"}}>{mm}月{dd}日 </h1>
          <p style={{marginBottom: "15px", fontSize: "17px" }}>{data2.anniv1}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "0 0 0 auto" }}>
          
          <Popover trigger={<img src={user?.avatarUrl ?? "https://via.placeholder.com/48"} alt={"icon"} style={{ marginRight: "30px", width: "40px", marginLeft: "10px", borderRadius: "50%", cursor: "pointer"}} />}>
            <div style={{ textAlign: "center", width: "200px" }}>
              <img src={user?.avatarUrl ?? "https://via.placeholder.com/48"} alt={"icon"} style={{ width: "48px", borderRadius: "50%", cursor: "pointer"}} />
              <p style={{ margin: "8px 0 0", fontWeight: "bold" }}>{user?.name}</p>
              <a href="/settings" style={{ display: "block", marginTop: "8px", fontSize: "14px", color: "#1e90ff" }}>設定</a>
              <a href="/api/logout" style={{ display: "block", marginTop: "8px", fontSize: "14px", color: "#1e90ff" }}>ログアウト</a>
            </div>
          </Popover>
          <a href="https://accounts.google.com/ServiceLogin?hl=ja&service=mail" style={{ display: "flex", gap: 8, alignItems: "center", margin: "0 0 0 auto" }}>
            <img src={"https://illustcenter.com/wp-content/uploads/2022/06/mailicon01.png"} alt={"mail icon"} style={{ width: "54px", height: "40px", paddingRight: "-10px"}} />
            <GmailBadge />
          </a>
        </div>
      </div>
      
      <div style={{ padding: "50px 30px", backgroundColor: "rgba(255, 255, 255, 0.7)", borderRadius: "30px"}}>  
        {user?.settings?.showCalendar && (<CalendarClient /> )}

        
        {user?.settings?.showWeather && (<Weather /> )}


        {user?.settings?.showNews && (<News /> )}
      </div>
    </main>
    
  );
}
