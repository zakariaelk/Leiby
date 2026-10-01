# Zakaria El Khachia — portfolio

Portfolio site built with [Astro](https://astro.build), content managed with [Keystatic](https://keystatic.com), hosted on Netlify.

## Run it locally

```bash
npm install
npm run dev
```

- Site: http://localhost:4321
- Content editor: https://leiby-design-build.netlify.app/keystatic (log in with GitHub; saves are commits to this repo)

## Design versions

The same content in three looks, side by side:

| URL | Version |
| --- | --- |
| `/` | Yellow, hand-drawn portrait |
| `/mono/` | Black & white, cartoon face with changing expressions |
| `/bridge/` | Black & white, line bridge + a tiny walker crossing the cities on scroll |
| `/simple/` | Content first, built to be skimmed: problem → what I did → result, plus “what was hard” on each case study |

The versions are set by URL prefix (`src/lib/variant.ts`), colours by `[data-theme]` in `src/styles/global.css`.
`/mono`, `/bridge` and `/simple` are hidden from search engines.

## Where things live

| What | Where |
| --- | --- |
| Projects (case studies) | `src/content/projects/*.mdoc` |
| Home page text, site settings | `src/content/pages/home.json`, `settings.json` |
| About page | `src/content/pages/about/index.mdoc` |
| Images | `src/assets/…` (optimised at build time) |
| Videos | `public/media/…` (MP4) |
| Design tokens (colours, type, spacing) | `src/styles/global.css` |
| Hero portrait + greeting bubble | `src/components/HeroPortrait.astro` (line drawing), `CartoonFace.astro` (cartoon, preview at /cartoon) |
| Get in touch button (mailto + shows the email) | `src/components/GetInTouch.astro` |
| Footer bridge animation | `src/components/BridgeBuild.astro` |
| City monuments | `src/components/Monument.astro` |
| Animated intro concept | `src/pages/concept.astro` (not linked, not indexed) |

## Deploy

Every push to `main` deploys on Netlify (build command and Node version are in `netlify.toml`).
