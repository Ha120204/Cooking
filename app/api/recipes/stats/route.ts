import type { NextRequest } from "next/server";
import { adminSupabase } from "@/lib/supabase/server";
import { emptyRecipeStat } from "@/lib/supabase/types";
import { noStoreJson } from "@/lib/security/request";
import { slugSchema } from "@/lib/validation/community";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("slugs") ?? "";
  const slugs = [...new Set(raw.split(",").filter(Boolean))];
  if (!slugs.length || slugs.length > 50 || slugs.some((slug) => !slugSchema.safeParse(slug).success)) {
    return noStoreJson({ error: "Danh sách công thức không hợp lệ." }, 400);
  }
  try {
    const { data, error } = await adminSupabase().from("recipe_stats")
      .select("recipe_slug,like_count,avg_rating,rating_count")
      .in("recipe_slug", slugs);
    if (error) throw error;
    const found = new Map((data ?? []).map((item) => [item.recipe_slug, item]));
    const stats = slugs.map((slug) => {
      const item = found.get(slug);
      return item ? {
        recipe_slug: slug,
        like_count: Number(item.like_count),
        avg_rating: item.avg_rating === null ? null : Number(item.avg_rating),
        rating_count: Number(item.rating_count),
      } : emptyRecipeStat(slug);
    });
    return noStoreJson({ stats });
  } catch (error) {
    console.error("recipe stats GET failed", error);
    return noStoreJson({ error: "Chưa tải được thống kê." }, 503);
  }
}
