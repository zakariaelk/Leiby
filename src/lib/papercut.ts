// Paper-cut shapes, in the spirit of ensemblelapalatine.com: shapes that look cut with scissors
// (a few straight-ish strokes, slightly off), never torn or jagged. Seeded, so every build
// draws the same shapes.

export const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/** An irregular "circle" cut in 10–13 strokes, as an SVG path around (cx, cy). */
export function blob(seed: number, cx: number, cy: number, r: number) {
  const rand = rng(seed);
  const n = 10 + Math.floor(rand() * 4);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = ((i + (rand() - 0.5) * 0.5) / n) * Math.PI * 2;
    const rr = r * (0.93 + rand() * 0.11);
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  });
  // each stroke bows out a touch, like a scissor cut that isn't perfectly straight
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i <= n; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i % n];
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    const k = 1.02 + rand() * 0.03;
    d += ` Q${(cx + (mx - cx) * k).toFixed(1)} ${(cy + (my - cy) * k).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d + 'Z';
}

/** The top edge of a paper band (viewBox 0 0 1000 24): long, gently uneven cuts. */
export function cutEdge(seed: number) {
  const rand = rng(seed);
  let x = 0, d = `M0 24 L0 ${(8 + rand() * 10).toFixed(1)}`;
  while (x < 1000) {
    x = Math.min(1000, x + 60 + rand() * 120);
    d += ` L${x.toFixed(1)} ${(3 + rand() * 15).toFixed(1)}`;
  }
  return d + ' L1000 24 Z';
}

/** A slightly uneven rectangle as a CSS clip-path polygon (for frames and images). */
export function unevenRect(seed: number, wobble = 1.2) {
  const rand = rng(seed);
  const j = () => (rand() * wobble).toFixed(2);
  const pts: string[] = [];
  for (let i = 0; i <= 10; i++) pts.push(`${i * 10}% ${j()}%`);
  for (let i = 1; i < 6; i++) pts.push(`${(100 - +j()).toFixed(2)}% ${i * 100 / 6}%`);
  for (let i = 10; i >= 0; i--) pts.push(`${i * 10}% ${(100 - +j()).toFixed(2)}%`);
  for (let i = 5; i > 0; i--) pts.push(`${j()}% ${i * 100 / 6}%`);
  return `polygon(${pts.join(', ')})`;
}

/** A rectangle with a ragged, marker-like edge: many small wobbles per side (CSS clip-path). */
export function raggedRect(seed: number, wobble = 0.6, steps = 24) {
  const rand = rng(seed);
  const j = () => (rand() * wobble).toFixed(2);
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) pts.push(`${(i * 100 / steps).toFixed(2)}% ${j()}%`);
  for (let i = 1; i < steps / 2; i++) pts.push(`${(100 - +j()).toFixed(2)}% ${(i * 200 / steps).toFixed(2)}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${(i * 100 / steps).toFixed(2)}% ${(100 - +j()).toFixed(2)}%`);
  for (let i = steps / 2 - 1; i > 0; i--) pts.push(`${j()}% ${(i * 200 / steps).toFixed(2)}%`);
  return `polygon(${pts.join(', ')})`;
}
