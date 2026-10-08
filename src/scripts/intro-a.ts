// Version A intro timeline (components/next/va/IntroA.astro). Runs only when the inline script in
// the page head has added html.is-intro (first home page view of the visit, no reduced motion, or
// ?intro in the URL). Any click, key press, wheel or touch skips to the end.
const root = document.documentElement;
const intro = document.querySelector<HTMLElement>('[data-intro]');

// ms after the writing starts; the spin lasts 1.375s, the middle of its 6th step (15° every 0.25s),
// so the circles always stop on that step, which the header logo is then set to
const T = { fold: 950, pop: 1400, spin: 1700, fly: 3075, end: 3775 };
const SPIN_AT = '-1.375s';

if (intro && root.classList.contains('is-intro')) {
  const svg = intro.querySelector<SVGSVGElement>('svg')!;
  const timers: number[] = [];
  let done = false;

  const cleanup = () => {
    root.classList.remove('is-intro', 'is-intro-reveal');
    intro.remove();
    document.dispatchEvent(new Event('ze:intro-done')); // e.g. the intro's marker highlight starts now
    removeEventListener('pointerdown', skip);
    removeEventListener('keydown', skip);
    removeEventListener('wheel', skip);
    removeEventListener('touchstart', skip);
  };
  const finish = () => {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    // the header logo takes over on the same frame the intro's circles stopped on
    document.querySelectorAll<SVGElement>('.n-brand__logo .n-logo__big-shape, .n-brand__logo .n-logo__small-shape').forEach((s) => { s.style.animationDelay = SPIN_AT; });
    cleanup();
  };
  // skipping: the page appears and the intro fades out quickly
  function skip() {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    root.classList.add('is-intro-reveal');
    intro!.classList.add('is-skip');
    window.setTimeout(cleanup, 320);
  }

  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
  const stage = (name: string) => () => intro.classList.add(`is-${name}`);

  const start = () => {
    if (done) return;
    if (scrollY > 0) { skip(); return; } // only from the top of the page
    // put the lone Z exactly where the Z of "Zakaria" is, so it can glide from there to the logo
    const word = svg.querySelector<SVGTextElement>('.i-word')!;
    const z = svg.querySelector<SVGTextElement>('.i-z')!;
    try {
      const from = word.getExtentOfChar(0), home = z.getExtentOfChar(0);
      z.style.setProperty('--from', `translate(${(from.x - home.x).toFixed(2)}px, ${(from.y - home.y).toFixed(2)}px)`);
    } catch { /* not laid out: it simply starts in place */ }
    intro.classList.add('is-ready');
    requestAnimationFrame(() => {
      stage('write')();
      at(T.fold, stage('fold'));
      at(T.pop, stage('pop'));
      at(T.spin, stage('spin'));
      at(T.fly, () => {
        // fly: shrink the logo onto the header logo, measured now so it lands exactly there
        const target = document.querySelector('.n-brand__logo svg')?.getBoundingClientRect();
        const m = svg.getScreenCTM();
        if (target && m) {
          const box = svg.getBoundingClientRect();
          const k = target.width / (200 * m.a);
          const tx = target.left - box.left - (m.e - box.left) * k;
          const ty = target.top - box.top - (m.f - box.top) * k;
          svg.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${k.toFixed(4)})`;
        }
        intro.classList.add('is-fly');
        root.classList.add('is-intro-reveal');
      });
      at(T.end, finish);
    });
  };

  addEventListener('pointerdown', skip);
  addEventListener('keydown', skip);
  addEventListener('wheel', skip, { passive: true });
  addEventListener('touchstart', skip, { passive: true });
  // the Latin name needs its font; wait for it, but not for long
  Promise.race([document.fonts.load('600 104px "Newsreader Variable"'), new Promise((r) => setTimeout(r, 800))]).then(start, start);
} else {
  intro?.remove();
}
