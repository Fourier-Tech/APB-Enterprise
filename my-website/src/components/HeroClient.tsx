"use client";

import { useEffect } from "react";

export default function HeroClient() {
  useEffect(() => {
    // ── Wait for loaderDone before starting any of these ──
    function bootstrap() {
      initScrollReveal();
      initCounters();
      initHeroSnap();
    }

    if ((window as any).__loaderDone) {
      bootstrap();
    } else {
      document.addEventListener("loaderDone", bootstrap, { once: true });
    }

    return () => {
      document.removeEventListener("loaderDone", bootstrap);
    };
  }, []);

  return null;
}

/* ══ SCROLL REVEAL ══ */
function initScrollReveal() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document
    .querySelectorAll(".reveal, .reveal-left, .reveal-scale, .stagger")
    .forEach((el) => obs.observe(el));
}

/* ══ AUTO-INCREMENT COUNTERS ══ */
function initCounters() {
  function animateCounter(el: Element) {
    const raw =
      el.getAttribute("data-count") || (el as HTMLElement).textContent?.trim();
    if (!raw) return;
    el.setAttribute("data-count", raw);
    const match = raw.match(/^(\d+)(.*)/);
    if (!match) return;
    const num = parseInt(match[1]);
    const suffix = match[2];
    const duration = 2000;
    const start = performance.now();

    function step(now: number) {
      const pct = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 4);
      (el as HTMLElement).textContent = Math.round(ease * num) + suffix;
      if (pct < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        animateCounter(e.target);
      });
    },
    { threshold: 0.4 },
  );

  document.querySelectorAll(".stat-num, .reach-stat-num").forEach((el) => {
    const text = (el as HTMLElement).textContent?.trim() || "";
    if (/^\d/.test(text)) {
      el.setAttribute("data-count", text);
      (el as HTMLElement).textContent =
        "0" + (text.match(/^(\d+)(.*)/)?.[2] || "");
      obs.observe(el);
    }
  });
}

/* ══ HERO → LIFT-ZONE SNAP ══
   When the user scrolls down with enough intent while the hero is fully
   visible, smoothly snap them straight to the lift-zone section. */
function initHeroSnap() {
  if (window.innerWidth <= 768) return; // Skip snap on mobile/phone screens
  const heroEl = document.getElementById("home-hero");
  const liftZoneEl = document.getElementById("lift-zone");
  if (!heroEl || !liftZoneEl) return;

  // Reassign as non-nullable so TypeScript retains the narrowing inside
  // nested callbacks (addEventListener handlers).
  const hero: HTMLElement = heroEl;
  const liftZone: HTMLElement = liftZoneEl;

  let snapping = false;
  let heroScrollAccum = 0;
  let heroTimer: ReturnType<typeof setTimeout> | null = null;
  let touchStartY = 0;

  function heroFullyVisible() {
    return window.scrollY < hero.offsetHeight * 0.15;
  }

  function snapToLift() {
    if (snapping) return;
    snapping = true;
    const targetY = liftZone.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: targetY, behavior: "smooth" });
    setTimeout(() => {
      snapping = false;
    }, 800);
  }

  const handleWheel = (e: WheelEvent) => {
    if (window.innerWidth <= 768) return; // Skip snap on mobile
    if (!heroFullyVisible()) return;
    if (e.deltaY <= 0) return;

    heroScrollAccum += e.deltaY;
    if (heroTimer) clearTimeout(heroTimer);
    heroTimer = setTimeout(() => {
      heroScrollAccum = 0;
    }, 200);

    if (heroScrollAccum > 60) {
      heroScrollAccum = 0;
      e.preventDefault();
      snapToLift();
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (window.innerWidth <= 768) return; // Skip snap on mobile
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (window.innerWidth <= 768) return; // Skip snap on mobile
    if (!heroFullyVisible()) return;
    const delta = touchStartY - e.changedTouches[0].clientY;
    if (delta > 60) snapToLift();
  };

  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Cleanup on hot-reload (the useEffect return handles it via the outer scope,
  // but since we're outside React here we attach a one-time pagehide guard)
  window.addEventListener(
    "pagehide",
    () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    },
    { once: true },
  );
}
