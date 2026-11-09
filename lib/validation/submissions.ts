import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().trim().min(2).max(100),
  amount: z.string().trim().min(1).max(30),
  unit: z.string().trim().max(30),
}).strict();

export const submissionSchema = z.object({
  display_name: z.string().trim().min(2).max(60),
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(10).max(1000),
  ingredients: z.array(ingredientSchema).min(1).max(30),
  steps: z.array(z.string().trim().min(10).max(1000)).min(1).max(15)
    .refine((steps) => steps.map((step, index) => `${index + 1}. ${step}`).join("\n\n").length <= 10000),
  image_url: z.union([z.url().max(2048).refine((value) => value.startsWith("https://")), z.literal("")]).default(""),
  image_credit: z.string().trim().max(200).default(""),
  rights_confirmed: z.literal(true),
  website: z.string().max(200).default(""),
}).strict();
