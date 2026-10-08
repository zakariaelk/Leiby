// Selected work list (version A home): hovering a row shows that project's cover as a small cut-out
// of paper that follows the pointer with a little lag, tilted a different way for each row (the
// tilt eases from one row to the next while the covers crossfade). Keyboard focus shows it beside
// the row. Only for a mouse or trackpad; with reduced motion it simply appears, without easing.
const list = document.querySelector<HTMLElement>('[data-peek-list]');
const peek = document.querySelector<HTMLElement>('.a-peek');
if (list && peek && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const imgs = [...peek.querySelectorAll<HTMLImageElement>('img')];
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0, shown = false, loaded = false;
  let focused: HTMLAnchorElement | null = null; // the row shown by keyboard focus

  const place = () => { peek.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`; };
  const aim = (cx: number, cy: number) => {
    const w = peek.offsetWidth, h = peek.offsetHeight;
    tx = cx + 32 + w > innerWidth - 16 ? cx - w - 32 : cx + 32; // flip to the left near the edge
    ty = Math.max(16, Math.min(cy - h * 0.55, innerHeight - h - 16));
  };
  const aimAtRow = (a: HTMLElement) => { const r = a.getBoundingClientRect(); aim(r.left + r.width * 0.62, r.top + r.height / 2); };
  const loop = () => {
    x += (tx - x) * 0.16;
    y += (ty - y) * 0.16;
    place();
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(loop) : 0;
  };
  const go = () => { if (reduce || !shown) { x = tx; y = ty; place(); } else if (!raf) raf = requestAnimationFrame(loop); };
  const show = (i: number) => {
    if (!loaded) { imgs.forEach((im) => { im.src = im.dataset.src!; }); loaded = true; }
    imgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
    peek.style.setProperty('--tilt', imgs[i]?.dataset.tilt ?? '0deg');
    go();
    peek.classList.add('is-shown');
    shown = true;
  };
  const hide = () => { peek.classList.remove('is-shown'); shown = false; };

  list.querySelectorAll<HTMLAnchorElement>('a[data-peek]').forEach((a) => {
    const i = Number(a.dataset.peek);
    a.addEventListener('pointerenter', (e) => { focused = null; aim(e.clientX, e.clientY); show(i); });
    a.addEventListener('pointermove', (e) => { aim(e.clientX, e.clientY); go(); });
    a.addEventListener('focus', () => {
      if (!a.matches(':focus-visible')) return;
      focused = a;
      aimAtRow(a);
      shown = false; // jump straight there
      show(i);
    });
    a.addEventListener('blur', () => { focused = null; hide(); });
  });
  list.addEventListener('pointerleave', () => { if (!focused) hide(); });
  // scrolling: a keyboard preview stays with its row; a pointer one goes once the pointer is off the list
  window.addEventListener('scroll', () => {
    if (!shown) return;
    if (focused) { aimAtRow(focused); x = tx; y = ty; place(); }
    else if (!list.matches(':hover')) hide();
  }, { passive: true });
}
