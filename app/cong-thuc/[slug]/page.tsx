import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllRecipes, getRecipeBySlug, renderRecipeBody } from "@/lib/recipes";
import { RecipeDetail } from "@/components/recipes/RecipeDetail";
import { RecipeViewTracker } from "@/components/analytics/RecipeViewTracker";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllRecipes()).map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();
  const url = `/cong-thuc/${slug}`;
  return {
    title: `${recipe.title} | Bếp Nhà Mình`,
    description: recipe.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "vi_VN",
      title: recipe.title,
      description: recipe.description,
      url,
      images: [{ url: recipe.cover, width: 1200, height: 900, alt: `Ảnh minh họa ${recipe.title}` }],
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();
  const [body, recipes] = await Promise.all([renderRecipeBody(recipe.body), getAllRecipes()]);
  const related = recipes.filter((item) => item.slug !== slug).slice(0, 3).map(({ body: _body, ...item }) => item);
  return <><RecipeViewTracker slug={slug} enabled={process.env.VERCEL_ENV === "production"} /><RecipeDetail recipe={recipe} body={body} related={related} /></>;
}
