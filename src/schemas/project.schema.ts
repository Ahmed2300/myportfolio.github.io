import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  detailedDescription: z.string().optional(),
  image: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  platform: z.string().optional(),
  tags: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  detailImages: z.array(z.string()).optional(),
  links: z.object({
    github: z.string().url().or(z.literal("")).optional(),
    demo: z.string().url().or(z.literal("")).optional(),
    playStore: z.string().url().or(z.literal("")).optional(),
    appStore: z.string().url().or(z.literal("")).optional(),
  }).optional(),
  featured: z.boolean().default(false),
  architecture: z.string().optional(),
  lastUpdated: z.number().optional()
});

export type Project = z.infer<typeof ProjectSchema>;
