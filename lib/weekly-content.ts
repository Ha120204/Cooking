import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { z } from "zod";

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const dayNames = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"] as const;

const weeklySchema = z.object({
  title: z.string().min(3),
  slug: slugSchema,
  weekStart: z.iso.date(),
  weekLabel: z.string().min(3),
  summary: z.string().min(10),
  recipeSlugs: z.array(slugSchema).min(1),
  days: z.array(z.object({
    name: z.enum(dayNames),
    title: z.string().min(3),
    note: z.string().min(5),
    recipeSlugs: z.array(slugSchema).min(1),
    sides: z.array(z.string().min(2)).default([]),
  })).length(7),
  shopping: z.array(z.object({ category: z.string().min(2), items: z.array(z.string().min(2)).min(1) })).default([]),
  publishedAt: z.iso.date(),
}).superRefine((menu, ctx) => {
  if (new Date(menu.weekStart + "T00:00:00Z").getUTCDay() !== 1) {
    ctx.addIssue({ code: "custom", path: ["weekStart"], message: "weekStart phải là thứ Hai" });
  }
  dayNames.forEach((name, index) => {
    if (menu.days[index]?.name !== name) {
      ctx.addIssue({ code: "custom", path: ["days", index, "name"], message: `Ngày ${index + 1} phải là ${name}` });
    }
  });
});

export type WeeklyMenu = z.infer<typeof weeklySchema> & { body: string };
const menuDir = path.join(process.cwd(), "content", "weekly-menus");

export async function getWeeklyMenuBySlug(slug: string): Promise<WeeklyMenu | null> {
  if (!slugSchema.safeParse(slug).success) return null;
  let source: string;
  try {
    source = await readFile(path.join(menuDir, slug + ".mdx"), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
  const parsed = matter(source);
  const metadata = weeklySchema.parse(parsed.data);
  if (metadata.slug !== slug) throw new Error(`Tên file và slug thực đơn không khớp: ${slug}`);
  return { ...metadata, body: parsed.content };
}

export async function getAllWeeklyMenus(): Promise<WeeklyMenu[]> {
  const names = (await readdir(menuDir)).filter((name) => name.endsWith(".mdx"));
  const menus = await Promise.all(names.map((name) => getWeeklyMenuBySlug(name.slice(0, -4))));
  return menus.filter((menu): menu is WeeklyMenu => menu !== null)
    .sort((a, b) => b.weekStart.localeCompare(a.weekStart));
}

export async function renderWeeklyMenuBody(body: string) {
  const { content } = await compileMDX({ source: body, options: { parseFrontmatter: false } });
  return content;
}
