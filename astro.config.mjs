// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';

// The Keystatic admin (/keystatic) edits files on disk, so it only runs with `npm run dev`.
// Production builds stay fully static.
const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://leiby-design-build.netlify.app',
  integrations: [react(), markdoc(), ...(isDev ? [keystatic()] : [])],
  adapter: netlify({ imageCDN: false, devFeatures: { images: false, edgeFunctions: false, environmentVariables: false } }),
  prefetch: {
    prefetchAll: true,
  },
});
