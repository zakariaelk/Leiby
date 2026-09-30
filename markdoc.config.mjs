import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    video: {
      render: component('./src/components/Video.astro'),
      selfClosing: true,
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
      },
    },
  },
});
