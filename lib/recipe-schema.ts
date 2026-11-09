import { z } from "zod";

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const recipeFrontmatterSchema = z.object({
  title: z.string().min(3).max(120),
  slug: slugSchema,
  description: z.string().min(20).max(500),
  cover: z.string().startsWith("/images/recipes/"),
  category: z.enum(["mon-chinh", "mon-canh", "mon-chay", "mon-cuon", "mon-khai-vi", "mon-an-sang"]),
  difficulty: z.enum(["de", "trung-binh", "kho"]),
  cookTime: z.number().int().positive(),
  servings: z.number().int().positive(),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    amount: z.union([z.number(), z.string()]),
    unit: z.string(),
  })).min(1),
  tags: z.array(z.string().min(1)),
  publishedAt: z.union([z.iso.date(), z.iso.datetime({ offset: true })]),
});

export type RecipeFrontmatter = z.infer<typeof recipeFrontmatterSchema>;
export type Recipe = RecipeFrontmatter & { body: string };

export const difficultyLabel: Record<RecipeFrontmatter["difficulty"], string> = {
  de: "Dễ",
  "trung-binh": "Vừa",
  kho: "Cầu kỳ",
};

export const categoryLabel: Record<RecipeFrontmatter["category"], string> = {
  "mon-chinh": "Món chính",
  "mon-canh": "Món canh",
  "mon-chay": "Món chay",
  "mon-cuon": "Món cuốn",
  "mon-khai-vi": "Khai vị / ăn vặt",
  "mon-an-sang": "Ăn sáng",
};
