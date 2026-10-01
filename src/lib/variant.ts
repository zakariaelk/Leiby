// Design versions living side by side. The yellow site is served at the root;
// the black-and-white versions live under their own prefix (/mono, /bridge).
export const variants = ['mono', 'bridge'] as const;
export type Theme = 'yellow' | (typeof variants)[number];

export function themeFor(pathname: string): { theme: Theme; base: string } {
  const seg = pathname.split('/')[1] ?? '';
  const theme = (variants as readonly string[]).includes(seg) ? (seg as Theme) : 'yellow';
  return { theme, base: theme === 'yellow' ? '' : `/${theme}` };
}
