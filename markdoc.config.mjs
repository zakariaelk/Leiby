import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    carousel: {
      render: component('./src/components/Carousel.astro'),
      attributes: { caption: { type: String } },
    },
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
