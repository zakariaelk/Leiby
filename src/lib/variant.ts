// Design versions living side by side, each under its own prefix (/yellow, /mono, …).
// The root of the site is the zakariaelk.com port (src/pages/index.astro, src/pages/work/).
export const variants = ['yellow', 'mono', 'bridge', 'simple', 'retro', 'ux', 'editorial'] as const;
export type Theme = (typeof variants)[number];

export function themeFor(pathname: string): { theme: Theme; base: string } {
  const seg = pathname.split('/')[1] ?? '';
  const theme = (variants as readonly string[]).includes(seg) ? (seg as Theme) : 'yellow';
  // The site root is the zakariaelk.com port; root pages that still use these layouts
  // (previews, 404) link into the yellow version.
  return { theme, base: `/${theme}` };
}
