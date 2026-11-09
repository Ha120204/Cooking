import type { NextRequest } from "next/server";
import { getRecipeBySlug } from "@/lib/recipes";
import { getWeeklyMenuBySlug } from "@/lib/weekly-content";
import { publicSupabase, adminSupabase } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { jsonBody, noStoreJson, sameOrigin } from "@/lib/security/request";
import { commentQuerySchema, commentSchema } from "@/lib/validation/community";

export async function GET(request: NextRequest) {
  const input = commentQuerySchema.safeParse({
    target_type: request.nextUrl.searchParams.get("target_type"),
    target_slug: request.nextUrl.searchParams.get("target_slug"),
  });
  if (!input.success) return noStoreJson({ error: "Tham số không hợp lệ." }, 400);
  try {
    const { data, error } = await publicSupabase()
      .from("comments")
      .select("id,target_type,target_slug,display_name,body,created_at")
      .eq("target_type", input.data.target_type)
      .eq("target_slug", input.data.target_slug)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return noStoreJson({ comments: data ?? [] });
  } catch (error) {
    console.error("comments GET failed", error);
    return noStoreJson({ error: "Chưa tải được bình luận." }, 503);
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return noStoreJson({ error: "Yêu cầu không hợp lệ." }, 403);
  const input = commentSchema.safeParse(await jsonBody(request));
  if (!input.success || input.data.website) return noStoreJson({ error: "Nội dung không hợp lệ." }, 400);
  try {
    const target = input.data.target_type === "recipe"
      ? await getRecipeBySlug(input.data.target_slug)
      : await getWeeklyMenuBySlug(input.data.target_slug);
    if (!target) return noStoreJson({ error: "Nội dung này không tồn tại." }, 404);
    if (!await checkRateLimit(request, "comment")) {
      return noStoreJson({ error: "Bạn gửi hơi nhanh. Hãy thử lại sau." }, 429);
    }
    const { data, error } = await adminSupabase().from("comments")
      .insert({
        target_type: input.data.target_type,
        target_slug: input.data.target_slug,
        display_name: input.data.display_name,
        body: input.data.body,
      })
      .select("id,target_type,target_slug,display_name,body,created_at")
      .single();
    if (error) throw error;
    return noStoreJson({ comment: data }, 201);
  } catch (error) {
    console.error("comments POST failed", error);
    return noStoreJson({ error: "Chưa gửi được bình luận." }, 503);
  }
}
