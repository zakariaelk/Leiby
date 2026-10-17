// Framed videos (.v-video) play only while on screen, and never with reduced motion (they then
// show their poster with controls).
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const videos = [...document.querySelectorAll<HTMLVideoElement>('.v-video')];
if (reduce) videos.forEach((v) => { v.controls = true; v.preload = 'metadata'; });
else {
  const io = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
    const v = target as HTMLVideoElement;
    if (isIntersecting) v.play().catch(() => {}); else v.pause();
  }), { threshold: 0.3 });
  // [data-play-center]: only once the video crosses the middle of the screen (the home page's teaser)
  const center = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
    const v = target as HTMLVideoElement;
    if (isIntersecting) v.play().catch(() => {}); else v.pause();
  }), { rootMargin: '-45% 0px -45% 0px' });
  videos.forEach((v) => (v.hasAttribute('data-play-center') ? center : io).observe(v));
}
