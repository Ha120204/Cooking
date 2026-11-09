import type { NextRequest } from "next/server";
import { getRecipeBySlug } from "@/lib/recipes";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { jsonBody, noStoreJson, sameOrigin } from "@/lib/security/request";
import { setVisitorCookie, visitorIdentity } from "@/lib/security/visitor";
import { adminSupabase } from "@/lib/supabase/server";
import { getRecipeStat } from "@/lib/supabase/stats";
import { emptyActionSchema, slugSchema } from "@/lib/validation/community";

type Context = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  if (!sameOrigin(request)) return noStoreJson({ error: "Yêu cầu không hợp lệ." }, 403);
  const input = emptyActionSchema.safeParse(await jsonBody(request));
  if (!input.success || input.data.website) return noStoreJson({ error: "Yêu cầu không hợp lệ." }, 400);
  const { slug } = await params;
  if (!slugSchema.safeParse(slug).success || !await getRecipeBySlug(slug)) {
    return noStoreJson({ error: "Không tìm thấy công thức." }, 404);
  }
  try {
    if (!await checkRateLimit(request, "like")) return noStoreJson({ error: "Bạn thao tác hơi nhanh." }, 429);
    const identity = visitorIdentity(request, true);
    if (!identity.hash) throw new Error("Visitor identity missing");
    const db = adminSupabase();
    const { data: existing, error: readError } = await db.from("recipe_likes")
      .select("recipe_slug").eq("recipe_slug", slug).eq("visitor_hash", identity.hash).maybeSingle();
    if (readError) throw readError;
    const result = existing
      ? await db.from("recipe_likes").delete().eq("recipe_slug", slug).eq("visitor_hash", identity.hash)
      : await db.from("recipe_likes").insert({ recipe_slug: slug, visitor_hash: identity.hash });
    if (result.error) throw result.error;
    const stat = await getRecipeStat(slug);
    return setVisitorCookie(noStoreJson({ liked: !existing, stat }), identity.newToken);
  } catch (error) {
    console.error("like POST failed", error);
    return noStoreJson({ error: "Chưa cập nhật được lượt thích." }, 503);
  }
}
