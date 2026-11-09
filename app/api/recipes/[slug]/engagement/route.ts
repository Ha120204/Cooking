import type { NextRequest } from "next/server";
import { getRecipeBySlug } from "@/lib/recipes";
import { visitorIdentity } from "@/lib/security/visitor";
import { noStoreJson } from "@/lib/security/request";
import { adminSupabase } from "@/lib/supabase/server";
import { getRecipeStat } from "@/lib/supabase/stats";
import { slugSchema } from "@/lib/validation/community";

type Context = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const { slug } = await params;
  if (!slugSchema.safeParse(slug).success || !await getRecipeBySlug(slug)) {
    return noStoreJson({ error: "Không tìm thấy công thức." }, 404);
  }
  try {
    const identity = visitorIdentity(request, false);
    const db = adminSupabase();
    const [stat, like, rating] = await Promise.all([
      getRecipeStat(slug),
      identity.hash ? db.from("recipe_likes").select("recipe_slug").eq("recipe_slug", slug).eq("visitor_hash", identity.hash).maybeSingle() : Promise.resolve({ data: null, error: null }),
      identity.hash ? db.from("recipe_ratings").select("stars").eq("recipe_slug", slug).eq("visitor_hash", identity.hash).maybeSingle() : Promise.resolve({ data: null, error: null }),
    ]);
    if (like.error || rating.error) throw like.error ?? rating.error;
    return noStoreJson({ stat, liked: !!like.data, my_rating: rating.data?.stars ?? null });
  } catch (error) {
    console.error("engagement GET failed", error);
    return noStoreJson({ error: "Chưa tải được tương tác." }, 503);
  }
}
