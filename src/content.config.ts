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
      // Skim layer: one sentence each, shown on cards and at the top of the case study
      tier: z.enum(['case', 'earlier']).default('case'),
      problem: z.string().optional(),
      did: z.string().optional(),
      result: z.string().optional(),
      hard: z.string().optional(),
      // Classic (zakariaelk.com) version: hover previews on the home list, grouped side menu
      previews: z.array(image()).default([]),
      featuredVideo: z.string().optional(),
      menu: z.array(z.object({
        group: z.string().default(''),
        items: z.array(z.object({ label: z.string(), heading: z.string() })),
      })).default([]),
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
