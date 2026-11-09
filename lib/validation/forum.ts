import { z } from "zod";

export const questionIdSchema = z.uuid();
export const questionCategorySchema = z.enum(["so-che", "nem-nem", "lua-thoi-gian", "meo-vat"]);

export const questionSchema = z.object({
  display_name: z.string().trim().min(2).max(60),
  title: z.string().trim().min(5).max(150),
  body: z.string().trim().min(10).max(3000),
  category: questionCategorySchema,
  website: z.string().max(200).default(""),
}).strict();

export const answerSchema = z.object({
  display_name: z.string().trim().min(2).max(60),
  body: z.string().trim().min(2).max(3000),
  website: z.string().max(200).default(""),
}).strict();
