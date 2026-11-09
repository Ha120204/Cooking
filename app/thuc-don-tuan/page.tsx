import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { WeeklyMenuIndex } from "@/components/weekly/WeeklyMenuIndex";
import { getAllWeeklyMenus } from "@/lib/weekly-content";
import { getAllRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Thực đơn tuần | Bếp Nhà Mình",
  description: "Gợi ý mâm cơm gia đình theo từng ngày, với công thức bếp nhà và danh mục đi chợ dễ theo dõi.",
  alternates: { canonical: "/thuc-don-tuan" },
};

export default async function WeeklyMenusPage() {
  const [menus, recipes] = await Promise.all([getAllWeeklyMenus(), getAllRecipes()]);
  return <><Header active="weekly" /><main className="pt-16 lg:pt-20"><WeeklyMenuIndex menus={menus.map(({ body: _body, ...menu }) => menu)} recipes={recipes.map(({ body: _body, ...recipe }) => recipe)} /></main><Footer /><MobileNav active="weekly" /></>;
}
