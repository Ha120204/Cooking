import type { NextRequest } from "next/server";
import { adminSupabase } from "@/lib/supabase/server";
import { ipHash } from "./visitor";

const limits = { comment: 5, like: 30, rating: 15 } as const;
export type RateAction = keyof typeof limits;

export async function checkRateLimit(request: NextRequest, action: RateAction) {
  const { data, error } = await adminSupabase().rpc("consume_rate_limit", {
    p_bucket_key: ipHash(request, action),
  });
  if (error) throw error;
  return Number(data) <= limits[action];
}
