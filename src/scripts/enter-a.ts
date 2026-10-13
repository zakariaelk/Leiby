// Home entrance (version A): the page appears top to bottom. Runs only when the layout's head
// script has added html.is-enter (no reduced motion); after the intro when there is one.
//   1. logo   2. nav   3. first paragraph, line by line from behind a mask
//   4. a short pause, then the second paragraph the same way
//   5. each featured case unmasks in one go as it comes into view (the first right after the hero)
// Words are wrapped where they stand (inline masks), so links, the speaker and the line breaks stay
// as they are; each word's delay comes from the line it sits on.
const root = document.documentElement;

const LINE = 90;     // ms between lines
const RISE = 800;    // ms for one line to rise
const PAUSE = 250;   // ms between the two paragraphs

/** Wrap every word (and the speaker button) of el in a mask, number them by line; returns the line count. */
function maskLines(el: HTMLElement) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.parentElement?.closest('button') === null && n.nodeValue!.trim()) texts.push(n as Text);
  const wrap = (node: Node) => {
    const w = document.createElement('span');
    w.className = 'a-w';
    const inner = document.createElement('span');
    inner.className = 'a-w__in';
    node.parentNode!.insertBefore(w, node);
    inner.append(node);
    w.append(inner);
  };
  texts.forEach((t) => {
    const parts = t.nodeValue!.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    parts.forEach((p) => {
      if (!p) return;
      if (/^\s+$/.test(p)) { frag.append(p); return; }
      const word = document.createTextNode(p);
      frag.append(word);
    });
    const nodes = [...frag.childNodes];
    t.replaceWith(frag);
    nodes.forEach((n) => { if (n.nodeType === 3 && n.nodeValue!.trim()) wrap(n); });
  });
  el.querySelectorAll('button').forEach((b) => wrap(b));
  // line index from each word's position
  let line = -1;
  let top = -Infinity;
  el.querySelectorAll<HTMLElement>('.a-w').forEach((w) => {
    const t = w.getBoundingClientRect().top;
    if (t > top + 4) { line += 1; top = t; }
    w.style.setProperty('--line', String(line));
  });
  return line + 1;
}

if (root.classList.contains('is-enter')) {
  root.classList.add('is-enter-js');
  const timers: number[] = [];
  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

  const p1 = document.querySelector<HTMLElement>('.a-hero > .a-statement');
  const more = document.querySelector<HTMLElement>('.a-hero > .a-more');
  const p2 = more && ([...more.querySelectorAll<HTMLElement>('.a-more__long, .a-more__short')].find((s) => s.offsetParent) ?? more);
  const n1 = p1 ? maskLines(p1) : 0;
  const n2 = p2 ? maskLines(p2) : 0;
  const dur = (n: number) => (n ? RISE + (n - 1) * LINE : 0);

  // featured cases: each unmasks when it comes into view, once the hero is in
  const cases = [...document.querySelectorAll<HTMLElement>('.a-feat')];
  // (watching the visual too: the first case's visual rises into the hero, above its card)
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const card = e.target.closest('.a-feat')!;
    card.classList.add('is-shown');
    card.querySelectorAll(':scope, .a-feat__visual').forEach((el) => io.unobserve(el));
  }), { rootMargin: '0px 0px -8% 0px' });

  const run = (fromNav: boolean) => {
    let t = 0;
    if (!fromNav) { root.classList.add('enter-logo'); t = 300; }
    at(t, () => root.classList.add('enter-nav'));
    t += 350;
    at(t, () => p1?.classList.add('is-in'));
    t += dur(n1) + PAUSE;
    at(t, () => p2?.classList.add('is-in'));
    t += dur(n2) * 0.6;
    at(t, () => {
      cases.forEach((c) => { io.observe(c); const v = c.querySelector('.a-feat__visual'); if (v) io.observe(v); });
      document.dispatchEvent(new Event('ze:enter-hero-done')); // e.g. the hero's marker highlight
    });
  };

  if (root.classList.contains('is-intro')) {
    // the intro's logo lands on the header logo: show it at once, then carry on from the nav
    document.addEventListener('ze:intro-done', () => {
      const logo = document.querySelector<HTMLElement>('.n-brand__logo');
      if (logo) logo.style.transition = 'none';
      root.classList.add('enter-logo');
      run(true);
    }, { once: true });
  } else {
    run(false);
  }
}
