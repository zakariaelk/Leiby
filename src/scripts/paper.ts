// Paper cut-outs that grow and shrink (logo pills, the "Read the case" circle): every
// [data-paper] element's own background is cut to a paperPill() outline, redrawn whenever its
// size changes (every frame while it animates). data-seed picks the cut, data-anchor the side
// it grows from.
import { paperPill } from '../lib/papercut';

const draw = (el: HTMLElement) => {
  el.style.clipPath = `path('${paperPill(el.offsetWidth, el.offsetHeight, +(el.dataset.seed ?? 1), el.dataset.anchor ?? 'left')}')`;
};
const ro = new ResizeObserver((entries) => entries.forEach((e) => draw(e.target as HTMLElement)));
document.querySelectorAll<HTMLElement>('[data-paper]').forEach((el) => { draw(el); ro.observe(el); });
