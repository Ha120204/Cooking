import type { MetadataRoute } from "next";
import { getAllRecipes } from "@/lib/recipes";

const siteUrl = (process.env.SITE_URL ?? "https://thanhtuyennt1405.id.vn").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await getAllRecipes();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/cong-thuc`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/hom-nay-an-gi`, changeFrequency: "monthly", priority: 0.7 },
    ...recipes.map((recipe) => ({
      url: `${siteUrl}/cong-thuc/${recipe.slug}`,
      lastModified: new Date(`${recipe.publishedAt}T00:00:00+07:00`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
