# Leiby Design & Build

Portfolio site built with [Astro](https://astro.build), content managed with [Keystatic](https://keystatic.com), hosted on Netlify.

## Run it locally

```bash
npm install
npm run dev
```

- Site: http://localhost:4321
- Content editor: http://localhost:4321/keystatic (only available while `npm run dev` is running)

## Where things live

| What | Where |
| --- | --- |
| Projects (case studies) | `src/content/projects/*.mdoc` |
| Blog posts | `src/content/posts/*.mdoc` |
| Services | `src/content/services/*.json` |
| Home page text, site settings | `src/content/pages/home.json`, `settings.json` |
| About page | `src/content/pages/about/index.mdoc` |
| Images | `src/assets/…` (optimised at build time) |
| Videos | `public/media/…` (MP4) |
| Design tokens (colours, type, spacing) | `src/styles/global.css` |

## Deploy

Every push to `main` deploys on Netlify (build command and Node version are in `netlify.toml`).
