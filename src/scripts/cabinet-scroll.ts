import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !prefersReducedMotion,
  syncTouch: false,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const hero = document.querySelector<HTMLElement>("[data-hero]");
if (hero) {
  const closed = hero.querySelector<HTMLElement>("[data-hero-closed]");
  const open = hero.querySelector<HTMLElement>("[data-hero-open]");
  const inside = hero.querySelector<HTMLElement>("[data-hero-inside]");
  const stage = hero.querySelector<HTMLElement>("[data-hero-stage]");
  const title = hero.querySelector<HTMLElement>("[data-hero-title]");
  const cue = hero.querySelector<HTMLElement>("[data-hero-cue]");
  const vignette = hero.querySelector<HTMLElement>("[data-hero-vignette]");

  // Set initial states
  gsap.set(open, { opacity: 0 });
  gsap.set(inside, { opacity: 0, scale: 1.18 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "+=200%",
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
    },
  });

  tl
    // 0 → 25%: title settles, vignette eases off as the cabinet pulls into focus
    .to(title, { opacity: 0, y: -30, duration: 0.25, ease: "power2.inOut" }, 0)
    .to(cue, { opacity: 0, duration: 0.1 }, 0)
    .to(vignette, { opacity: 0.35, duration: 0.25 }, 0)
    // 25 → 55%: doors crossfade open + slight push-in
    .to(closed, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, 0.25)
    .to(open, { opacity: 1, duration: 0.3, ease: "power2.inOut" }, 0.25)
    .to(stage, { scale: 1.06, duration: 0.3, ease: "none" }, 0.25)
    // 55 → 100%: camera glides INTO the cabinet — open photo recedes, interior takes over
    .to(open, { opacity: 0, duration: 0.45, ease: "power2.inOut" }, 0.55)
    .to(inside, { opacity: 1, scale: 1.0, duration: 0.45, ease: "power2.inOut" }, 0.55)
    .to(stage, { scale: 1.18, duration: 0.45, ease: "none" }, 0.55)
    .to(vignette, { opacity: 0, duration: 0.45 }, 0.6);

  // Mouse parallax — 3 Z-layers drift with cursor
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const layers = hero.querySelectorAll<HTMLElement>("[data-parallax]");
    let mx = 0, my = 0, cx = 0, cy = 0;

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width - 0.5;
      my = (e.clientY - rect.top) / rect.height - 0.5;
    });

    const tick = () => {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.parallax || "0");
        layer.style.transform = `translate3d(${-cx * depth}px, ${-cy * depth}px, 0)`;
      });
      requestAnimationFrame(tick);
    };
    tick();
  }
}

// Editorial section reveals
const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
reveals.forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 82%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 28,
    duration: 0.9,
    ease: "power2.out",
  });
});

// Anchor links route through Lenis for smooth scroll
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target as HTMLElement, { offset: -8 });
  });
});
