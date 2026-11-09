import type { NextRequest } from "next/server";
import { adminSupabase } from "@/lib/supabase/server";
import { noStoreJson } from "@/lib/security/request";

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return noStoreJson({ error: "Unauthorized" }, 401);
  }
  try {
    const { error } = await adminSupabase().from("comments").select("id").limit(1);
    if (error) throw error;
    return noStoreJson({ ok: true });
  } catch (error) {
    console.error("health GET failed", error);
    return noStoreJson({ ok: false }, 503);
  }
}
