import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { HomeContent } from "@/components/home/HomeContent";
import { getAllRecipes } from "@/lib/recipes";
import { getAllWeeklyMenus } from "@/lib/weekly-content";

export default async function HomePage() {
  const [recipes, menus] = await Promise.all([
    getAllRecipes(),
    getAllWeeklyMenus(),
  ]);

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <Suspense>
          <HomeContent
            recipes={recipes.map(({ body, ...recipe }) => recipe)}
            menus={menus.map(({ body: _body, ...menu }) => menu)}
          />
        </Suspense>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
