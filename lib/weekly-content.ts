import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const weeklySchema = z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  weekLabel: z.string().min(3),
  summary: z.string().min(10),
  recipeSlugs: z.array(z.string()).default([]),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type WeeklyContent = z.infer<typeof weeklySchema> & { body: string };

export async function getLatestWeeklyContent(
  kind: "weekly-menus" | "weekly-challenges",
): Promise<WeeklyContent | null> {
  const dir = path.join(process.cwd(), "content", kind);
  const files = (await readdir(dir)).filter((name) => name.endsWith(".mdx")).sort().reverse();
  if (!files.length) return null;
  const source = await readFile(path.join(dir, files[0]), "utf8");
  const parsed = matter(source);
  const metadata = weeklySchema.parse(parsed.data);
  return { ...metadata, body: parsed.content };
}
