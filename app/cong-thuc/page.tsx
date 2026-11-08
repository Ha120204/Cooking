import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { RecipeExplorer } from "@/components/recipes/RecipeExplorer";
import { getAllRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Công thức món ngon gia đình | Bếp Nhà Mình",
  description: "Tìm công thức bếp nhà theo loại món, độ khó và thời gian nấu. Lưu món yêu thích để dễ tìm lại.",
  alternates: { canonical: "/cong-thuc" },
};

function ExplorerFallback() {
  return <div className="mx-auto max-w-[1200px] animate-pulse px-4 py-16"><div className="mx-auto h-10 max-w-md rounded-bep-md bg-bep-dim" /><div className="mx-auto mt-7 h-14 max-w-3xl rounded-bep-md bg-bep-dim" /><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-72 rounded-bep-md bg-bep-dim" />)}</div></div>;
}

export default async function RecipesPage() {
  const recipes = (await getAllRecipes()).map(({ body: _body, ...recipe }) => recipe);
  return <><Header active="recipe" /><main className="pt-16 lg:pt-20"><Suspense fallback={<ExplorerFallback />}><RecipeExplorer recipes={recipes} /></Suspense></main><Footer /><MobileNav active="recipe" /></>;
}
