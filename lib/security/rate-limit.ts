import type { NextRequest } from "next/server";
import { adminSupabase } from "@/lib/supabase/server";
import { ipHash } from "./visitor";

const limits = { comment: 5, like: 30, rating: 15, recipe_submission: 2, question: 2, answer: 5 } as const;
export type RateAction = keyof typeof limits;

export async function checkRateLimit(request: NextRequest, action: RateAction) {
  const rpc = action === "answer" ? "consume_rate_limit_10m" : "consume_rate_limit";
  const { data, error } = await adminSupabase().rpc(rpc, {
    p_bucket_key: ipHash(request, action),
  });
  if (error) throw error;
  return Number(data) <= limits[action];
}
