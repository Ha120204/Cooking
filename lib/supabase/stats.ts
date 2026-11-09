import { adminSupabase } from "./server";
import { emptyRecipeStat, type RecipeStat } from "./types";

export async function getRecipeStat(slug: string): Promise<RecipeStat> {
  const { data, error } = await adminSupabase()
    .from("recipe_stats")
    .select("recipe_slug,like_count,avg_rating,rating_count")
    .eq("recipe_slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return emptyRecipeStat(slug);
  return {
    recipe_slug: data.recipe_slug,
    like_count: Number(data.like_count),
    avg_rating: data.avg_rating === null ? null : Number(data.avg_rating),
    rating_count: Number(data.rating_count),
  };
}
