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

export type QuestionCategory = "so-che" | "nem-nem" | "lua-thoi-gian" | "meo-vat";

export const questionCategoryLabels: Record<QuestionCategory, string> = {
  "so-che": "Sơ chế & khử tanh",
  "nem-nem": "Gia vị nêm nếm",
  "lua-thoi-gian": "Lửa & thời gian",
  "meo-vat": "Mẹo vặt",
};

export type PublicQuestion = {
  id: string;
  display_name: string;
  title: string;
  body: string;
  category: QuestionCategory;
  created_at: string;
  answer_count: number;
};

export type PublicAnswer = {
  id: string;
  question_id: string;
  display_name: string;
  body: string;
  created_at: string;
};
