import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { HomeContent } from "@/components/home/HomeContent";
import { getAllRecipes } from "@/lib/recipes";
import { getLatestWeeklyContent } from "@/lib/weekly-content";

export default async function HomePage() {
  const [recipes, menu, challenge] = await Promise.all([
    getAllRecipes(),
    getLatestWeeklyContent("weekly-menus"),
    getLatestWeeklyContent("weekly-challenges"),
  ]);

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <HomeContent
          recipes={recipes.map(({ body, ...recipe }) => recipe)}
          menu={menu && { title: menu.title, summary: menu.summary, weekLabel: menu.weekLabel, recipeSlugs: menu.recipeSlugs }}
          challenge={challenge && { title: challenge.title, summary: challenge.summary, weekLabel: challenge.weekLabel }}
        />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
