# Zakaria El Khachia — portfolio

Portfolio site built with [Astro](https://astro.build), content managed with [Keystatic](https://keystatic.com), hosted on Netlify.

## Run it locally

```bash
npm install
npm run dev
```

- Site: http://localhost:4321
- Content editor: https://leiby-design-build.netlify.app/keystatic (log in with GitHub; saves are commits to this repo)

## Where things live

| What | Where |
| --- | --- |
| Projects (case studies) | `src/content/projects/*.mdoc` |
| Home page text, site settings | `src/content/pages/home.json`, `settings.json` |
| About page | `src/content/pages/about/index.mdoc` |
| Images | `src/assets/…` (optimised at build time) |
| Videos | `public/media/…` (MP4) |
| Design tokens (colours, type, spacing) | `src/styles/global.css` |
| Hero illustrations | `src/components/HeroCharacter.astro` (home), `HeroPortrait.astro` (/portrait and About) |

## Deploy

Every push to `main` deploys on Netlify (build command and Node version are in `netlify.toml`).
