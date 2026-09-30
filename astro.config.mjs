// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://leiby-design-build.netlify.app',
  integrations: [react(), markdoc(), keystatic()],
  adapter: netlify({ imageCDN: false, devFeatures: { images: false, edgeFunctions: false, environmentVariables: false } }),
  prefetch: {
    prefetchAll: true,
  },
});
