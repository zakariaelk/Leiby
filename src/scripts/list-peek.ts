// Selected work list (version A home): hovering a row shows that project's cover just above the row,
// so the row's name and description stay readable. It follows the pointer sideways with a little
// lag and glides from row to row while the covers crossfade; no room above (a row near the top of
// the window) puts it below the row. Keyboard focus shows it above the focused row. Only for a
// mouse or trackpad; with reduced motion it moves without easing.
const list = document.querySelector<HTMLElement>('[data-peek-list]');
const peek = document.querySelector<HTMLElement>('.a-peek');
if (list && peek && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const imgs = [...peek.querySelectorAll<HTMLImageElement>('img')];
  const GAP = 12, EDGE = 16;
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0, shown = false, loaded = false;
  let row: HTMLElement | null = null; // the row being shown
  let px = 0; // pointer x (or the focused row's anchor)

  const place = () => { peek.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`; };
  const aim = () => {
    if (!row) return;
    const r = row.getBoundingClientRect(), w = peek.offsetWidth, h = peek.offsetHeight;
    tx = Math.max(EDGE, Math.min(px - w / 2, innerWidth - w - EDGE));
    ty = r.top - GAP - h >= EDGE ? r.top - GAP - h : r.bottom + GAP; // above the row, else below it
  };
  const loop = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    place();
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(loop) : 0;
  };
  const go = () => { aim(); if (reduce || !shown) { x = tx; y = ty; place(); } else if (!raf) raf = requestAnimationFrame(loop); };
  const show = (a: HTMLElement, i: number) => {
    if (!loaded) { imgs.forEach((im) => { im.src = im.dataset.src!; }); loaded = true; }
    row = a;
    imgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
    go();
    peek.classList.add('is-shown');
    shown = true;
  };
  const hide = () => { peek.classList.remove('is-shown'); shown = false; row = null; };
  let focused: HTMLElement | null = null;

  list.querySelectorAll<HTMLAnchorElement>('a[data-peek]').forEach((a) => {
    const i = Number(a.dataset.peek);
    a.addEventListener('pointerenter', (e) => { focused = null; px = e.clientX; show(a, i); });
    a.addEventListener('pointermove', (e) => { px = e.clientX; go(); });
    a.addEventListener('focus', () => {
      if (!a.matches(':focus-visible')) return;
      focused = a;
      const r = a.getBoundingClientRect();
      px = r.left + r.width * 0.5;
      shown = false; // jump straight there
      show(a, i);
    });
    a.addEventListener('blur', () => { focused = null; hide(); });
  });
  list.addEventListener('pointerleave', () => { if (!focused) hide(); });
  // scrolling: the cover stays with its row while the pointer (or focus) is still on it
  window.addEventListener('scroll', () => {
    if (!shown) return;
    if (focused || list.matches(':hover')) { aim(); x = tx; y = ty; place(); } else hide();
  }, { passive: true });
}
