export type CommentTarget = "recipe" | "weekly_menu";

export type PublicComment = {
  id: string;
  target_type: CommentTarget;
  target_slug: string;
  display_name: string;
  body: string;
  created_at: string;
};

export type RecipeStat = {
  recipe_slug: string;
  like_count: number;
  avg_rating: number | null;
  rating_count: number;
};

export const emptyRecipeStat = (slug: string): RecipeStat => ({
  recipe_slug: slug,
  like_count: 0,
  avg_rating: null,
  rating_count: 0,
});
