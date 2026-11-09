import type { NextRequest } from "next/server";
import { getRecipeBySlug } from "@/lib/recipes";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { jsonBody, noStoreJson, sameOrigin } from "@/lib/security/request";
import { setVisitorCookie, visitorIdentity } from "@/lib/security/visitor";
import { adminSupabase } from "@/lib/supabase/server";
import { getRecipeStat } from "@/lib/supabase/stats";
import { ratingSchema, slugSchema } from "@/lib/validation/community";

type Context = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  if (!sameOrigin(request)) return noStoreJson({ error: "Yêu cầu không hợp lệ." }, 403);
  const input = ratingSchema.safeParse(await jsonBody(request));
  if (!input.success || input.data.website) return noStoreJson({ error: "Số sao không hợp lệ." }, 400);
  const { slug } = await params;
  if (!slugSchema.safeParse(slug).success || !await getRecipeBySlug(slug)) {
    return noStoreJson({ error: "Không tìm thấy công thức." }, 404);
  }
  try {
    if (!await checkRateLimit(request, "rating")) return noStoreJson({ error: "Bạn thao tác hơi nhanh." }, 429);
    const identity = visitorIdentity(request, true);
    if (!identity.hash) throw new Error("Visitor identity missing");
    const { error } = await adminSupabase().from("recipe_ratings")
      .upsert({ recipe_slug: slug, visitor_hash: identity.hash, stars: input.data.stars, updated_at: new Date().toISOString() },
        { onConflict: "recipe_slug,visitor_hash" });
    if (error) throw error;
    const stat = await getRecipeStat(slug);
    return setVisitorCookie(noStoreJson({ my_rating: input.data.stars, stat }), identity.newToken);
  } catch (error) {
    console.error("rating POST failed", error);
    return noStoreJson({ error: "Chưa cập nhật được đánh giá." }, 503);
  }
}
