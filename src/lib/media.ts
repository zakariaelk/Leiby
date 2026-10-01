import type { ImageMetadata } from 'astro';

// Content blocks name their media by path, so images can be looked up (and optimised) here.
// Images: a path inside src/assets, e.g. projects/my-project/screen.jpg
// Videos: a path in public/, e.g. /media/projects/my-project/clip.mp4, with a poster frame
// at src/assets/projects/my-project/posters/clip.jpg
const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png,webp}', { eager: true });

export function assetImage(path: string): ImageMetadata | undefined {
  const key = path.startsWith('/src/') ? path : `/src/assets/${path.replace(/^\/+/, '')}`;
  return images[key]?.default;
}

export function posterFor(videoSrc: string): ImageMetadata | undefined {
  const m = videoSrc.match(/\/media\/(projects\/[^/]+)\/([^/]+)\.mp4$/);
  return m ? assetImage(`${m[1]}/posters/${m[2]}.jpg`) : undefined;
}

// "[CONFIRM: …]" markers in plain-text fields (frontmatter), split out so they can be flagged
export function splitConfirm(text = '') {
  const parts: { text: string; confirm?: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(/\[CONFIRM:\s*([^\]]+)\]/g)) {
    if (m.index! > last) parts.push({ text: text.slice(last, m.index) });
    parts.push({ text: m[1].trim(), confirm: true });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
