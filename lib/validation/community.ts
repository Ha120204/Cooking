import { z } from "zod";

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100);

export const commentQuerySchema = z.object({
  target_type: z.enum(["recipe", "weekly_menu"]),
  target_slug: slugSchema,
});

export const commentSchema = commentQuerySchema.extend({
  display_name: z.string().trim().min(2).max(60),
  body: z.string().trim().min(2).max(2000),
  website: z.string().max(200).default(""),
}).strict();

export const emptyActionSchema = z.object({ website: z.string().max(200).default("") }).strict();
export const ratingSchema = emptyActionSchema.extend({ stars: z.number().int().min(1).max(5) });
