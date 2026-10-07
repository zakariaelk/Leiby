// The paper behind each "Read the case" button, painted like the frames around the visuals: a
// rounded box whose edge wobbles a pixel or two (a slow drift plus fine brush jitter). On hover
// (or focus) the wobble travels around the outline like a bicycle chain, in visible jumps (about
// 6 a second, stop-motion); it stops where it is when the pointer leaves. Redrawn whenever the
// button changes size.
const M = 72; // bumps around the outline
const SPEED = 50; // px per second along the edge
const STEP = 160; // ms between jumps (8px each)

const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// a point at distance s along a rounded rectangle (x, y, w, h, corner r), with its outward normal
const along = (s: number, x: number, y: number, w: number, h: number, r: number) => {
  const sw = w - 2 * r, sh = h - 2 * r, q = (Math.PI * r) / 2;
  const segs: [number, (t: number) => [number, number, number, number]][] = [
    [sw, (t) => [x + r + t, y, 0, -1]],
    [q, (t) => { const a = -Math.PI / 2 + t / r; return [x + w - r + Math.cos(a) * r, y + r + Math.sin(a) * r, Math.cos(a), Math.sin(a)]; }],
    [sh, (t) => [x + w, y + r + t, 1, 0]],
    [q, (t) => { const a = t / r; return [x + w - r + Math.cos(a) * r, y + h - r + Math.sin(a) * r, Math.cos(a), Math.sin(a)]; }],
    [sw, (t) => [x + w - r - t, y + h, 0, 1]],
    [q, (t) => { const a = Math.PI / 2 + t / r; return [x + r + Math.cos(a) * r, y + h - r + Math.sin(a) * r, Math.cos(a), Math.sin(a)]; }],
    [sh, (t) => [x, y + h - r - t, -1, 0]],
    [q, (t) => { const a = Math.PI + t / r; return [x + r + Math.cos(a) * r, y + r + Math.sin(a) * r, Math.cos(a), Math.sin(a)]; }],
  ];
  for (const [len, at] of segs) { if (s <= len) return at(s); s -= len; }
  return segs[0][1](0);
};

document.querySelectorAll<HTMLElement>('.n-btn').forEach((btn, i) => {
  const paint = btn.querySelector<HTMLElement>('.n-btn__paint');
  if (!paint) return;
  const rand = seeded(97 + i * 31);
  // smoothed jitter, plus a slow drift two or three times around, all periodic so the chain closes
  const jit: number[] = [];
  let j = 0;
  for (let k = 0; k < M * 2; k++) { j = j * 0.55 + (rand() - 0.5) * 1.3; if (k >= M) jit.push(j); }
  const f = 2 + Math.floor(rand() * 2), ph = rand() * 6.28, bump = Math.floor(rand() * M);
  const offset = (u: number) => {
    const x = (((u % 1) + 1) % 1) * M, k = Math.floor(x), t = x - k;
    const n = jit[k] * (1 - t) + jit[(k + 1) % M] * t;
    const dist = Math.min((x - bump + M) % M, (bump - x + M) % M);
    const b = 1.4 * Math.max(0, 1 - dist / 2.5); // one small lump of paint
    return 2.2 + 0.9 * Math.sin(6.283 * f * u + ph) + n + b;
  };
  let phase = 0; // px travelled along the edge
  const draw = () => {
    const pad = 6, w = paint.offsetWidth - 2 * pad, h = paint.offsetHeight - 2 * pad, r = 3;
    const per = 2 * (w + h - 4 * r) + 2 * Math.PI * r;
    const n = Math.max(60, Math.round(per / 3));
    let d = '';
    for (let k = 0; k < n; k++) {
      const s = (k / n) * per;
      const [px, py, nx, ny] = along(s, pad, pad, w, h, r);
      const o = offset((s - phase) / per);
      d += `${k ? 'L' : 'M'}${(px + nx * o).toFixed(1)} ${(py + ny * o).toFixed(1)}`;
    }
    paint.style.clipPath = `path('${d}Z')`;
  };
  draw();
  new ResizeObserver(draw).observe(paint);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let timer = 0;
  const start = () => { if (!timer) { phase += (STEP / 1000) * SPEED; draw(); timer = window.setInterval(() => { phase += (STEP / 1000) * SPEED; draw(); }, STEP); } };
  const stop = () => { clearInterval(timer); timer = 0; };
  btn.addEventListener('pointerenter', start);
  btn.addEventListener('pointerleave', stop);
  btn.addEventListener('focus', start);
  btn.addEventListener('blur', stop);
});
