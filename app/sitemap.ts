import type { MetadataRoute } from "next";
import { getAllRecipes } from "@/lib/recipes";
import { getAllWeeklyMenus } from "@/lib/weekly-content";

const siteUrl = (process.env.SITE_URL ?? "https://thanhtuyennt1405.id.vn").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [recipes, menus] = await Promise.all([getAllRecipes(), getAllWeeklyMenus()]);
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/cong-thuc`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/hom-nay-an-gi`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/thuc-don-tuan`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/hoi-bep`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/gui-cong-thuc`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/chinh-sach-rieng-tu`, changeFrequency: "monthly", priority: 0.5 },
    ...menus.map((menu) => ({
      url: `${siteUrl}/thuc-don-tuan/${menu.slug}`,
      lastModified: new Date(`${menu.publishedAt}T00:00:00+07:00`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...recipes.map((recipe) => ({
      url: `${siteUrl}/cong-thuc/${recipe.slug}`,
      lastModified: new Date(`${recipe.publishedAt}T00:00:00+07:00`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
