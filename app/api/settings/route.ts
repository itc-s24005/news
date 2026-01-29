import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";

/* =========================
 * GET: 設定取得
 * ========================= */
export async function GET() {
  const store = await cookies();
  const userId = store.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // settings がなければ作る
  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      // デフォルト値（schema.prisma 側の default が使われる）
      observationLocation: ["東京", "新宿"],
      followMedia: [],
      showWeather: true,
      showCalendar: true,
      showNews: true,
    },
  });

  return NextResponse.json(settings);
}

/* =========================
 * PUT: 設定更新
 * ========================= */
export async function PUT(req: Request) {
  const store = await cookies();
  const userId = store.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const {
    showWeather,
    showCalendar,
    showNews,
    observationLocation,
  } = body as {
    showWeather?: boolean;
    showCalendar?: boolean;
    showNews?: boolean;
    observationLocation?: string[];
  };

  const updated = await prisma.userSettings.update({
    where: { userId },
    data: {
      ...(typeof showWeather === "boolean" && { showWeather }),
      ...(typeof showCalendar === "boolean" && { showCalendar }),
      ...(typeof showNews === "boolean" && { showNews }),
      ...(Array.isArray(observationLocation) && {
        observationLocation,
      }),
    },
  });

  return NextResponse.json(updated);
}
