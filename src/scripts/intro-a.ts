// Version A intro timeline (components/next/va/IntroA.astro). Runs only when the inline script in
// the page head has added html.is-intro (first home page view of the visit, no reduced motion, or
// ?intro in the URL). Any click, key press, wheel or touch skips to the end.
// Typed mode (html.is-typed, /tests/typed-intro/): after the logo lands the nav fades in, the hero
// sentence types out letter by letter (with a "Show all" link at the bottom), "designer" and
// "builder" get their marker, then the rest of the page appears.
const root = document.documentElement;
const intro = document.querySelector<HTMLElement>('[data-intro]');

// ms from the start: the circles pop in, spin 1.5s in the middle, fly (0.75s) to the header while
// spinning, and stop 1.75s after the flight began
const T = { spin: 300, fly: 1800, land: 2550, stop: 3550 };

if (intro && root.classList.contains('is-intro')) {
  const logo = intro.querySelector<SVGSVGElement>('svg')!;
  const timers: number[] = [];
  let done = false;

  // the header logo spins in step with the intro's: both animations start in the same frame
  const spin = (on: boolean) => root.classList.toggle('is-logo-spin', on);
  const typed = root.classList.contains('is-typed');
  const listeners = (on: boolean) => {
    const f = on ? addEventListener : removeEventListener;
    f('pointerdown', skip); f('keydown', skip); f('wheel', skip, { passive: true } as AddEventListenerOptions); f('touchstart', skip, { passive: true } as AddEventListenerOptions);
  };
  const cleanup = () => {
    root.classList.remove('is-intro', 'is-intro-reveal', 'is-typed', 'is-nav-in');
    intro.remove();
    listeners(false);
    document.dispatchEvent(new Event('ze:intro-done')); // e.g. the intro's marker highlight starts now
  };
  // skipping: the page appears, the intro fades out quickly and the spinning stops
  function skip() {
    if (typing) { typing.finish(); return; } // while typing: show the whole sentence at once
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    spin(false);
    if (typed) { revealTyped(); return; }
    root.classList.add('is-intro-reveal');
    intro!.classList.add('is-skip');
    window.setTimeout(cleanup, 320);
  }

  // ---- typed mode ----
  let typing: { finish: () => void } | null = null;
  const hero = document.querySelector<HTMLElement>('.a-hero .a-statement');
  // each letter becomes a hidden span that keeps its place (nothing reflows while typing); the
  // speaker counts as one more step, right after its "a"
  const steps: HTMLElement[] = [];
  if (typed && hero) {
    const walk = (node: Node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...(n.textContent ?? '')].forEach((ch) => { const sp = document.createElement('span'); sp.className = 't-ch'; sp.textContent = ch; frag.append(sp); steps.push(sp); });
          n.replaceWith(frag);
        } else if ((n as HTMLElement).classList?.contains('a-say')) { (n as HTMLElement).classList.add('t-ch'); steps.push(n as HTMLElement); }
        else walk(n);
      });
    };
    walk(hero);
  }
  const revealTyped = () => {
    // the whole sentence, its marker, then the page
    steps.forEach((s) => s.classList.add('is-on'));
    document.querySelector('.t-caret')?.remove();
    document.querySelector('.t-showall')?.remove();
    typing = null;
    root.classList.add('is-nav-in');
    intro.classList.add('is-skip');
    window.setTimeout(() => document.querySelectorAll('.a-hero .a-mark').forEach((m) => m.classList.add('is-drawn')), 200);
    window.setTimeout(() => root.classList.add('is-intro-reveal'), 1200);
    window.setTimeout(cleanup, 2000);
  };
  const typeHero = () => {
    const caret = document.createElement('span');
    caret.className = 't-caret';
    caret.setAttribute('aria-hidden', 'true');
    const show = document.createElement('button');
    show.type = 'button';
    show.className = 't-showall';
    show.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>Show all';
    document.body.append(show);
    let i = 0, t = 0;
    const next = () => {
      if (i >= steps.length) { typing = null; revealTyped(); return; }
      steps[i].classList.add('is-on');
      steps[i].after(caret);
      i++;
      t = window.setTimeout(next, 25);
    };
    typing = { finish: () => { clearTimeout(t); typing = null; revealTyped(); } };
    next();
  };

  const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

  const start = () => {
    if (done) return;
    if (scrollY > 0) { skip(); return; } // only from the top of the page
    intro.classList.add('is-ready');
    requestAnimationFrame(() => {
      intro.classList.add('is-pop');
      at(T.spin, () => { intro.classList.add('is-spin'); spin(true); });
      at(T.fly, () => {
        // fly: shrink the logo onto the header logo, measured now so it lands exactly there
        const target = document.querySelector('.n-brand__logo svg')?.getBoundingClientRect();
        const box = logo.getBoundingClientRect();
        if (target) {
          const k = target.width / box.width;
          logo.style.transform = `translate(${(target.left - box.left).toFixed(1)}px, ${(target.top - box.top).toFixed(1)}px) scale(${k.toFixed(4)})`;
        }
        intro.classList.add('is-fly');
        if (!typed) root.classList.add('is-intro-reveal');
      });
      at(T.land, () => {
        done = true;
        if (!typed) { cleanup(); return; }
        // typed: the overlay goes, the nav fades in as the logo lands, and the typing starts
        intro.classList.add('is-skip');
        root.classList.add('is-nav-in');
        typeHero();
      });
    });
    // the stop outlives the clean-up: by then the header logo is the one spinning
    window.setTimeout(() => spin(false), T.stop);
  };

  listeners(true);
  // the Z needs its font; wait for it, but not for long
  Promise.race([document.fonts.load('600 104px "Newsreader Variable"'), new Promise((r) => setTimeout(r, 800))]).then(start, start);
} else {
  intro?.remove();
}
