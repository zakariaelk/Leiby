import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const color = z.enum(['coral', 'blue', 'mint', 'pink']).default('coral');

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
      color,
      order: z.number().default(99),
      featured: z.boolean().default(false),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tag: z.string().default('Notes'),
    color,
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    short: z.string(),
    summary: z.string(),
    deliverables: z.array(z.string()).default([]),
    icon: z.enum(['target', 'browser', 'phone', 'chart', 'blocks', 'spark']),
    color,
    order: z.number().default(99),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: 'index.mdoc', base: './src/content/pages/about' }),
  schema: z.object({
    title: z.string(),
    intro: z.string(),
    experience: z.array(z.object({ name: z.string(), role: z.string(), years: z.string() })),
  }),
});

export const collections = { projects, posts, services, about };
