import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/SettingsClient";

export default async function SettingsPage() {
  const store = await cookies();
  const userId = store.get("user_id")?.value; // ← ここ！

  if (!userId) {
    redirect("/api/auth");
  }

  return <SettingsClient />;
}
