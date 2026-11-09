import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { recipeFrontmatterSchema, type Recipe } from "./recipe-schema";

const recipeDir = path.join(process.cwd(), "content", "recipes");
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  if (!validSlug.test(slug)) return null;
  let source: string;
  try {
    source = await readFile(path.join(recipeDir, slug + ".mdx"), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }

  const parsed = matter(source);
  const metadata = recipeFrontmatterSchema.parse(parsed.data);
  if (metadata.slug !== slug) {
    throw new Error("Tên file và slug frontmatter không khớp: " + slug);
  }
  let cover = metadata.cover;
  try {
    await access(path.join(process.cwd(), "public", cover.slice(1)));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    cover = `/anh-minh-hoa/${slug}`;
  }
  return { ...metadata, cover, body: parsed.content };
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const names = (await readdir(recipeDir)).filter((name) => name.endsWith(".mdx"));
  const recipes = await Promise.all(
    names.map((name) => getRecipeBySlug(name.slice(0, -4))),
  );
  return recipes
    .filter((recipe): recipe is Recipe => recipe !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function renderRecipeBody(body: string) {
  const { content } = await compileMDX({
    source: body,
    options: { parseFrontmatter: false },
  });
  return content;
}
