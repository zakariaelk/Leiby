// Version A intro timeline (components/next/va/IntroA.astro). Runs only when the inline script in
// the page head has added html.is-intro (first home page view of the visit, no reduced motion, or
// ?intro in the URL). Any click, key press, wheel or touch skips to the end.
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
  const cleanup = () => {
    root.classList.remove('is-intro', 'is-intro-reveal');
    intro.remove();
    removeEventListener('pointerdown', skip);
    removeEventListener('keydown', skip);
    removeEventListener('wheel', skip);
    removeEventListener('touchstart', skip);
    document.dispatchEvent(new Event('ze:intro-done')); // e.g. the intro's marker highlight starts now
  };
  // skipping: the page appears, the intro fades out quickly and the spinning stops
  function skip() {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    spin(false);
    root.classList.add('is-intro-reveal');
    intro!.classList.add('is-skip');
    window.setTimeout(cleanup, 320);
  }

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
        root.classList.add('is-intro-reveal');
      });
      at(T.land, () => { done = true; cleanup(); });
    });
    // the stop outlives the clean-up: by then the header logo is the one spinning
    window.setTimeout(() => spin(false), T.stop);
  };

  addEventListener('pointerdown', skip);
  addEventListener('keydown', skip);
  addEventListener('wheel', skip, { passive: true });
  addEventListener('touchstart', skip, { passive: true });
  // the Z needs its font; wait for it, but not for long
  Promise.race([document.fonts.load('600 104px "Newsreader Variable"'), new Promise((r) => setTimeout(r, 800))]).then(start, start);
} else {
  intro?.remove();
}
