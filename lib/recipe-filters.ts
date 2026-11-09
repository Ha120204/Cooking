import type { RecipeFrontmatter } from "./recipe-schema";
import { normalizeSearch } from "./normalize";

export const categories = ["mon-canh", "mon-chinh", "mon-chay", "mon-cuon"] as const;
export const difficulties = ["de", "trung-binh", "kho"] as const;
export const timeOptions = ["15", "30", "60", "over-60"] as const;
export const sortOptions = ["moi-nhat", "nhanh-nhat", "ten-mon"] as const;

export type Category = (typeof categories)[number];
export type Difficulty = (typeof difficulties)[number];
export type TimeOption = (typeof timeOptions)[number];
export type SortOption = (typeof sortOptions)[number];

export type RecipeFilters = {
  q: string;
  category: Category | null;
  difficulty: Difficulty | null;
  time: TimeOption | null;
  favoritesOnly: boolean;
  sort: SortOption;
};

export const defaultRecipeFilters: RecipeFilters = {
  q: "",
  category: null,
  difficulty: null,
  time: null,
  favoritesOnly: false,
  sort: "moi-nhat",
};

function oneOf<const T extends readonly string[]>(values: T, value: string | null): T[number] | null {
  return value && values.includes(value) ? value as T[number] : null;
}

export function parseRecipeFilters(params: { get(name: string): string | null }): RecipeFilters {
  return {
    q: (params.get("q") ?? "").slice(0, 100),
    category: oneOf(categories, params.get("loai")),
    difficulty: oneOf(difficulties, params.get("do-kho")),
    time: oneOf(timeOptions, params.get("thoi-gian")),
    favoritesOnly: params.get("yeu-thich") === "1",
    sort: oneOf(sortOptions, params.get("sap-xep")) ?? "moi-nhat",
  };
}

export function recipeFiltersHref(filters: RecipeFilters) {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.category) params.set("loai", filters.category);
  if (filters.difficulty) params.set("do-kho", filters.difficulty);
  if (filters.time) params.set("thoi-gian", filters.time);
  if (filters.favoritesOnly) params.set("yeu-thich", "1");
  if (filters.sort !== "moi-nhat") params.set("sap-xep", filters.sort);
  return "/cong-thuc" + (params.size ? `?${params}` : "");
}

export function filterRecipes(recipes: RecipeFrontmatter[], filters: RecipeFilters, favorites: string[]) {
  const query = normalizeSearch(filters.q.trim());
  const favoriteSet = new Set(favorites);
  return recipes.filter((recipe) => {
    if (filters.category && recipe.category !== filters.category) return false;
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) return false;
    if (filters.time === "over-60" && recipe.cookTime <= 60) return false;
    if (filters.time && filters.time !== "over-60" && recipe.cookTime > Number(filters.time)) return false;
    if (filters.favoritesOnly && !favoriteSet.has(recipe.slug)) return false;
    if (!query) return true;
    return [recipe.title, recipe.description, ...recipe.tags, ...recipe.ingredients.map((ingredient) => ingredient.name)]
      .some((value) => normalizeSearch(value).includes(query));
  }).sort((a, b) => {
    if (filters.sort === "nhanh-nhat") return a.cookTime - b.cookTime;
    if (filters.sort === "ten-mon") return a.title.localeCompare(b.title, "vi");
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}
