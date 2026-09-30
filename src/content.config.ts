import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      headline: z.string(),
      summary: z.string(),
      intro: z.string(),
      sector: z.string().optional(),
      role: z.string().optional(),
      duration: z.string().optional(),
      year: z.string(),
      link: z.string().optional(),
      cover: image(),
      order: z.number().default(99),
      featured: z.boolean().default(false),
    }),
});

const timeline = z.array(z.object({ name: z.string(), role: z.string(), years: z.string() })).default([]);

const about = defineCollection({
  loader: glob({ pattern: 'index.mdoc', base: './src/content/pages/about' }),
  schema: z.object({
    title: z.string(),
    intro: z.string(),
    experience: timeline,
    education: timeline,
    languages: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, about };
