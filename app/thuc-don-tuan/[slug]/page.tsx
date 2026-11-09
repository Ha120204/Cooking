import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { WeeklyMenuDetail } from "@/components/weekly/WeeklyMenuDetail";
import { getAllWeeklyMenus, getWeeklyMenuBySlug, renderWeeklyMenuBody } from "@/lib/weekly-content";
import { getAllRecipes } from "@/lib/recipes";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllWeeklyMenus()).map((menu) => ({ slug: menu.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const menu = await getWeeklyMenuBySlug(slug);
  if (!menu) notFound();
  const recipe = (await getAllRecipes()).find((item) => item.slug === menu.recipeSlugs[0]);
  return {
    title: `${menu.weekLabel}: ${menu.title} | Bếp Nhà Mình`,
    description: menu.summary,
    alternates: { canonical: `/thuc-don-tuan/${slug}` },
    openGraph: {
      type: "article", locale: "vi_VN", title: `${menu.weekLabel}: ${menu.title}`,
      description: menu.summary, url: `/thuc-don-tuan/${slug}`,
      images: recipe ? [{ url: recipe.cover, width: 1200, height: 900, alt: `Ảnh minh họa ${menu.title}` }] : [],
    },
  };
}

export default async function WeeklyMenuPage({ params }: Props) {
  const { slug } = await params;
  const menu = await getWeeklyMenuBySlug(slug);
  if (!menu) notFound();
  const [recipes, menus, body] = await Promise.all([getAllRecipes(), getAllWeeklyMenus(), renderWeeklyMenuBody(menu.body)]);
  return <><Header active="weekly" /><main className="pt-16 lg:pt-20"><WeeklyMenuDetail menu={menu} recipes={recipes.map(({ body: _body, ...recipe }) => recipe)} body={body} otherMenus={menus.filter((item) => item.slug !== slug).map(({ slug, title, weekLabel }) => ({ slug, title, weekLabel }))} /></main><Footer /><MobileNav active="weekly" /></>;
}
