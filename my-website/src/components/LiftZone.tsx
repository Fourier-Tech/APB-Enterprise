"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./LiftZone.css";

interface ProductData {
  id: number;
  name: string;
  modelCode: string | null;
  shortDesc: string;
  category: string;
  imageUrl: string | null;
}



const scriptLoadingPromises: { [src: string]: Promise<void> | undefined } = {};

/**
 * Dynamically loads external CDN scripts synchronously and asynchronously.
 * Incorporates standard promise caching to prevent multiple parallel fetches.
 * 
 * NOTE: Implements a 50ms polling checking cycle for window globals alongside
 * normal onload events. This completely avoids silent promise hangs when scripts
 * are already appended to the document body but unmount states/re-renders override onload.
 * 
 * @param {string} src - The absolute CDN script source URL.
 * @returns {Promise<void>} Resolves when the script has completed loading and is globally ready.
 */
const loadScript = (src: string): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();

  if (scriptLoadingPromises[src]) {
    return scriptLoadingPromises[src];
  }

  const checkGlobal = () => {
    if (src.includes("gsap") && (window as any).gsap) {
      return true;
    }
    if (src.includes("jsvectormap.min.js") && (window as any).jsVectorMap) {
      return true;
    }
    if (src.includes("world.js") && (window as any).jsVectorMap?.maps?.world) {
      return true;
    }
    return false;
  };

  const promise = new Promise<void>((resolve, reject) => {
    // If already defined globally, resolve immediately
    if (checkGlobal()) {
      resolve();
      return;
    }

    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    if (existing) {
      const interval = setInterval(() => {
        if (checkGlobal()) {
          clearInterval(interval);
          resolve();
        }
      }, 50);

      const oldOnload = existing.onload;
      existing.onload = (e) => {
        clearInterval(interval);
        if (oldOnload) (oldOnload as any).call(existing, e);
        resolve();
      };
      existing.onerror = (e) => {
        clearInterval(interval);
        reject(e);
      };
      return;
    }

    const s = document.createElement("script");
    s.src = src;

    const interval = setInterval(() => {
      if (checkGlobal()) {
        clearInterval(interval);
        resolve();
      }
    }, 50);

    s.onload = () => {
      clearInterval(interval);
      resolve();
    };
    s.onerror = (e) => {
      clearInterval(interval);
      reject(e);
    };
    document.body.appendChild(s);
  });

  scriptLoadingPromises[src] = promise;
  return promise;
};

export default function LiftZone({
  featuredProducts,
}: {
  featuredProducts: ProductData[];
}) {
  useEffect(() => {
    let isDestroyed = false;
    let mapInstance: any = null;


    async function init() {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/js/jsvectormap.min.js",
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/maps/world.js",
      );

      const gsap = (window as any).gsap;

      // ── MAP ──
      const countries = [
        "IN",
        "OM",
        "AE",
        "LK",
        "BD",
        "ZA",
        "NP",
        // "BH",
        "NG",
        "BR",
      ];
      try {
        mapInstance = new (window as any).jsVectorMap({
          selector: "#world-map",
          map: "world",
          backgroundColor: "transparent",
          regionStyle: {
            initial: { fill: "#EBEBEB", stroke: "#FFFFFF", strokeWidth: 0.5 },
            hover: { fill: "#0F6978", cursor: "pointer" },
            selected: { fill: "#0F6978" },
            selectedHover: { fill: "#1A8A9E" },
          },
          selectedRegions: countries,
          zoomButtons: false,
          zoomOnScroll: false,
        });
      } catch (e) {
        console.warn("Map failed", e);
      }

      // ── LIFT ZONE SCROLL-JACK ──
      // Query all elements once and guard in one place
      const liftZoneEl = document.getElementById("lift-zone");
      const elevatorEl = document.getElementById("lz-elevator");
      const progressEl = document.getElementById("lz-progress");
      const scrollHintEl = document.getElementById("lz-scroll-hint");

      // Single null-guard — after this block TypeScript knows all are HTMLElement
      if (
        !(liftZoneEl instanceof HTMLElement) ||
        !(elevatorEl instanceof HTMLElement) ||
        !(progressEl instanceof HTMLElement) ||
        !(scrollHintEl instanceof HTMLElement)
      )
        return;

      // Now alias as non-nullable so all inner functions use them safely
      const lz = liftZoneEl;
      const elev = elevatorEl;
      const prog = progressEl;
      const hint = scrollHintEl;

      const FLOORS = 3;
      const LIFT_TOPS = ["0%", "33.33%", "66.66%"];

      let currentFloor = 0;
      let isAnimating = false;
      let liftActive = false;
      let doorTimeline: any = null;

      gsap.set(".lz-panel", {
        opacity: 0,
        y: 30,
        visibility: "hidden",
        pointerEvents: "none",
      });
      gsap.set("#lz-panel-0", {
        opacity: 1,
        y: 0,
        visibility: "visible",
        pointerEvents: "auto",
      });

      let isProgrammaticScroll = false;
      let progScrollTimer: ReturnType<typeof setTimeout> | null = null;
      let lastScrollY = window.scrollY;

      function changeFloorInstantly(target: number) {
        if (target === currentFloor) return;
        const old = currentFloor;
        currentFloor = target;

        gsap.killTweensOf(".lz-panel");
        if (doorTimeline) doorTimeline.kill();

        gsap.set(`#lz-panel-${old}`, {
          opacity: 0,
          y: -25,
          visibility: "hidden",
          pointerEvents: "none",
        });
        gsap.set(`#lz-panel-${target}`, {
          visibility: "visible",
          pointerEvents: "auto",
          y: 0,
          opacity: 1,
        });

        document
          .querySelectorAll<HTMLElement>(".lz-floor-label")
          .forEach((el) =>
            el.classList.toggle("active", Number(el.dataset.floor) === target),
          );
        document
          .querySelectorAll<HTMLElement>(".lz-dot")
          .forEach((el) =>
            el.classList.toggle("active", Number(el.dataset.target) === target),
          );

        elev.classList.remove("open");
        gsap.set(elev, { top: LIFT_TOPS[target] });
      }

      function changeFloor(target: number, syncScroll = false) {
        if (target === currentFloor || isAnimating) return;
        isAnimating = true;

        const old = currentFloor;
        currentFloor = target;

        if (syncScroll) {
          const liftZoneTop = window.scrollY + lz.getBoundingClientRect().top;
          const targetY = liftZoneTop + window.innerHeight * target;
          isProgrammaticScroll = true;
          window.scrollTo({ top: targetY, behavior: "auto" });
          if (progScrollTimer) clearTimeout(progScrollTimer);
          progScrollTimer = setTimeout(() => {
            isProgrammaticScroll = false;
          }, 150);
        }

        gsap.to(`#lz-panel-${old}`, {
          opacity: 0,
          y: -25,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () =>
            gsap.set(`#lz-panel-${old}`, {
              visibility: "hidden",
              pointerEvents: "none",
            }),
        });
        gsap.set(`#lz-panel-${target}`, {
          visibility: "visible",
          pointerEvents: "auto",
          y: 30,
        });
        gsap.to(`#lz-panel-${target}`, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.25,
          ease: "power2.out",
        });

        document
          .querySelectorAll<HTMLElement>(".lz-floor-label")
          .forEach((el) =>
            el.classList.toggle("active", Number(el.dataset.floor) === target),
          );
        document
          .querySelectorAll<HTMLElement>(".lz-dot")
          .forEach((el) =>
            el.classList.toggle("active", Number(el.dataset.target) === target),
          );

        if (doorTimeline) doorTimeline.kill();
        elev.classList.remove("open");
        doorTimeline = gsap.timeline();
        doorTimeline.to(
          elev,
          { top: LIFT_TOPS[target], duration: 0.8, ease: "power2.inOut" },
          0,
        );
        doorTimeline.add(() => elev.classList.add("open"), 0.8);
        doorTimeline.add(() => elev.classList.remove("open"), 2.3);

        hint.style.opacity = "0";

        let floorCooldown = false;
        let floorCooldownTimer: ReturnType<typeof setTimeout> | null = null;
        setTimeout(() => {
          isAnimating = false;
          floorCooldown = true;
          if (floorCooldownTimer) clearTimeout(floorCooldownTimer);
          floorCooldownTimer = setTimeout(() => {
            floorCooldown = false;
          }, 400);
        }, 1200);
      }

      function isLiftZoneActive() {
        const rect = lz.getBoundingClientRect();
        // Only treat as active once the section has fully scrolled into the viewport
        // (top edge at or above the viewport top), not while it's still arriving from below
        return rect.top <= 0 && rect.bottom >= window.innerHeight - 2;
      }

      let wheelAccum = 0;
      let wheelTimer: ReturnType<typeof setTimeout> | null = null;
      let floorCooldown = false;
      let lastWheelTime = 0;

      const handleWheel = (e: WheelEvent) => {
        if (window.innerWidth <= 768) return; // Disable scroll-jacking on mobile
        if (!isLiftZoneActive()) return;
        const now = Date.now();
        if (now - lastWheelTime > 150) {
          isProgrammaticScroll = false;
          floorCooldown = false;
        }
        lastWheelTime = now;

        if (e.deltaY > 0 && currentFloor >= FLOORS - 1) return;
        if (e.deltaY < 0 && currentFloor <= 0) return;

        e.preventDefault();

        if (isProgrammaticScroll || floorCooldown || isAnimating) {
          wheelAccum = 0;
          return;
        }

        wheelAccum += e.deltaY;
        if (wheelTimer) clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
          wheelAccum = 0;
        }, 200);

        if (wheelAccum > 30) {
          wheelAccum = 0;
          changeFloor(Math.min(currentFloor + 1, FLOORS - 1), true);
        } else if (wheelAccum < -30) {
          wheelAccum = 0;
          changeFloor(Math.max(currentFloor - 1, 0), true);
        }
      };

      let touchStartY = 0;
      const handleTouchStart = (e: TouchEvent) => {
        if (window.innerWidth <= 768) return; // Disable scroll-jacking on mobile
        touchStartY = e.touches[0].clientY;
      };
      const handleTouchEnd = (e: TouchEvent) => {
        if (window.innerWidth <= 768) return;
        if (!isLiftZoneActive() || isAnimating || isProgrammaticScroll) return;
        const delta = touchStartY - e.changedTouches[0].clientY;
        if (delta > 40 && currentFloor < FLOORS - 1)
          changeFloor(currentFloor + 1, true);
        else if (delta < -40 && currentFloor > 0)
          changeFloor(currentFloor - 1, true);
      };

      document.querySelectorAll<HTMLElement>(".lz-dot").forEach((dot) => {
        dot.addEventListener("click", () => {
          if (window.innerWidth <= 768) return; // Disable dot clicks on mobile
          const target = Number(dot.dataset.target);
          if (isNaN(target)) return;
          if (!isLiftZoneActive()) {
            isProgrammaticScroll = true;
            if (progScrollTimer) clearTimeout(progScrollTimer);
            progScrollTimer = setTimeout(() => {
              isProgrammaticScroll = false;
            }, 1200);
            lz.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => changeFloor(target, true), 600);
          } else {
            changeFloor(target, true);
          }
        });
      });

      function onPageScroll() {
        if (window.innerWidth <= 768) {
          prog.classList.remove("visible");
          hint.classList.remove("visible");
          lastScrollY = window.scrollY;
          return;
        }

        const active = isLiftZoneActive();
        prog.classList.toggle("visible", active);

        const rect = lz.getBoundingClientRect();
        const liftZoneTop = window.scrollY + rect.top;
        const liftZoneBottom = liftZoneTop + window.innerHeight * FLOORS;
        const scrollingUp = window.scrollY < lastScrollY;

        // ── Proximity snap: pull user into lift zone before they drift past ──
        // Threshold: within 40% of a viewport-height of either boundary.
        // Snap fires only when the lift zone boundary is right at the viewport edge
        // (within a small pixel buffer), so it feels like a natural handoff.
        const SNAP_THRESHOLD = window.innerHeight * 0.25;

        if (!isProgrammaticScroll && !active) {
          // Approaching from above (scrolling down): lift zone top is about to cross viewport top
          const distFromTop = liftZoneTop - window.scrollY;
          if (!scrollingUp && distFromTop > 0 && distFromTop < SNAP_THRESHOLD) {
            isProgrammaticScroll = true;
            wheelAccum = 0;
            window.scrollTo({ top: liftZoneTop, behavior: "smooth" });
            changeFloorInstantly(0);
            liftActive = true;
            if (progScrollTimer) clearTimeout(progScrollTimer);
            progScrollTimer = setTimeout(() => {
              isProgrammaticScroll = false;
            }, 800);
            lastScrollY = window.scrollY;
            return;
          }

          // Approaching from below (scrolling up, near the bottom boundary)
          // Fire when the lift zone bottom is ~65% of a viewport above the fold
          // (matches the point in the screenshot where the Reach section is peeking)
          const BOTTOM_SNAP_THRESHOLD = window.innerHeight * 0.65;
          const distFromBottom =
            window.scrollY + window.innerHeight - liftZoneBottom;
          if (
            scrollingUp &&
            distFromBottom > 0 &&
            distFromBottom < BOTTOM_SNAP_THRESHOLD
          ) {
            isProgrammaticScroll = true;
            wheelAccum = 0;
            const snapTop = liftZoneTop + window.innerHeight * (FLOORS - 1);
            window.scrollTo({ top: snapTop, behavior: "smooth" });
            changeFloorInstantly(FLOORS - 1);
            liftActive = true;
            if (progScrollTimer) clearTimeout(progScrollTimer);
            progScrollTimer = setTimeout(() => {
              isProgrammaticScroll = false;
            }, 800);
            lastScrollY = window.scrollY;
            return;
          }
        }

        if (active && !liftActive) {
          liftActive = true;
          if (!isProgrammaticScroll) {
            isProgrammaticScroll = true;
            wheelAccum = 0;
            const entryFloor = scrollingUp ? FLOORS - 1 : 0;
            const snapTop = liftZoneTop + window.innerHeight * entryFloor;
            window.scrollTo({ top: snapTop, behavior: "auto" });
            changeFloorInstantly(entryFloor);
            if (progScrollTimer) clearTimeout(progScrollTimer);
            progScrollTimer = setTimeout(() => {
              isProgrammaticScroll = false;
            }, 800);
            lastScrollY = window.scrollY;
            return;
          }
        } else if (!active && liftActive) {
          liftActive = false;
        }
        lastScrollY = window.scrollY;

        if (active && !isProgrammaticScroll) {
          const scrolledInto = window.scrollY - liftZoneTop;
          let targetFloor = 0;
          if (
            scrolledInto > window.innerHeight * 0.5 &&
            scrolledInto < window.innerHeight * 1.5
          )
            targetFloor = 1;
          else if (scrolledInto >= window.innerHeight * 1.5) targetFloor = 2;
          if (currentFloor !== targetFloor) changeFloorInstantly(targetFloor);
        }

        if (active && currentFloor === 0) hint.classList.add("visible");
        else hint.classList.remove("visible");
      }

      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
      window.addEventListener("scroll", onPageScroll, { passive: true });
      onPageScroll();

      return () => {
        isDestroyed = true;
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("scroll", onPageScroll);

        // Destroy map instance to prevent memory leaks and clean up DOM elements
        if (mapInstance && typeof mapInstance.destroy === "function") {
          try {
            mapInstance.destroy();
          } catch (e) {
            console.warn("Failed to destroy map", e);
          }
        }

        // Clean up any dynamic tooltips appended to body
        const tooltips = document.querySelectorAll(".jvm-tooltip");
        tooltips.forEach((el) => el.remove());
      };
    }

    init();
  }, []);

  return (
    <div id="lift-zone">
      <div id="lift-sticky">
        {/* Progress dots */}
        <div id="lz-progress">
          {[
            { label: "About", idx: 0 },
            { label: "Flagship", idx: 1 },
            { label: "Reach", idx: 2 },
          ].map((d) => (
            <div
              key={d.idx}
              className={`lz-dot${d.idx === 0 ? " active" : ""}`}
              data-target={d.idx}
            >
              <span className="lz-dot-text">{d.label}</span>
              <span className="lz-dot-btn"></span>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div id="lz-scroll-hint">
          <i className="fas fa-chevron-down"></i>
          <span>Scroll to explore</span>
        </div>

        <div className="building-container">
          {/* Left — floor labels */}
          <div className="lz-left-col">
            {[
              { label: "About", idx: 0 },
              { label: "Flagship", idx: 1 },
              { label: "Reach", idx: 2 },
            ].map((f) => (
              <div
                key={f.idx}
                className={`lz-floor-label${f.idx === 0 ? " active" : ""}`}
                data-floor={f.idx}
              >
                <span className="lz-floor-label-text">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Center — elevator shaft */}
          <div className="lz-center-col">
            <div className="lz-guide-rail left"></div>
            <div className="lz-guide-rail right"></div>
            <div className="lz-floor-sill" style={{ top: "0%" }}></div>
            <div className="lz-floor-sill" style={{ top: "33.33%" }}></div>
            <div className="lz-floor-sill" style={{ top: "66.66%" }}></div>
            <div className="lz-elevator-car" id="lz-elevator">
              <div className="lz-car-door left-door"></div>
              <div className="lz-car-door right-door"></div>
            </div>
          </div>

          {/* Right — content panels */}
          <div className="lz-right-col">
            {/* Floor 0: About */}
            <div className="lz-panel" id="lz-panel-0">
              <div className="lz-panel-tag">First Floor · About APB</div>
              <h2>
                Engineering trust
                <br />
                <em style={{ fontStyle: "normal", color: "var(--teal)" }}>
                  since 2018.
                </em>
              </h2>
              <div
                className="about-inner"
                style={{
                  gridTemplateColumns: "160px 1fr",
                  gap: "2.5rem",
                  maxWidth: "820px",
                  marginBottom: "2rem",
                }}
              >
                <span className="about-label">About APB</span>
                <div className="about-body">
                  <p>
                    Founded in 2018, APB Enterprise has grown from a small
                    engineering team into a registered LLP trusted by elevator
                    manufacturers across India and Southeast Asia. We build
                    controllers, door operators, safety gears, and COP panels —
                    components that move millions of people every day, safely
                    and silently.
                  </p>
                  <Link href="/about" className="about-link">
                    Learn more about us{" "}
                    <i className="fas fa-arrow-right fa-xs"></i>
                  </Link>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              ></div>
            </div>

            {/* Floor 1: Flagship Products */}
            <div className="lz-panel" id="lz-panel-1">
              <div className="lz-panel-tag">Second Floor · Flagship Range</div>
              <div className="section-head" style={{ marginBottom: "1.75rem" }}>
                <h2 className="section-title">
                  Engineered for extreme reliability
                </h2>
                <Link
                  href="/products"
                  className="btn-ghost"
                  style={{ marginBottom: "4px" }}
                >
                  View all <i className="fas fa-arrow-right fa-xs"></i>
                </Link>
              </div>
              <div
                className="products-grid stagger lz-products-grid"
                data-count={featuredProducts.slice(0, 4).length}
              >
                {featuredProducts.slice(0, 4).map((p) => {
                  const slug = p.modelCode ?? String(p.id);
                  return (
                  <Link
                    key={p.id}
                    href={`/products/${encodeURIComponent(slug)}`}
                    className="product-card"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="product-img-wrap lz-product-img-wrap">
                      <div className="product-watermark">
                        <i className="fas fa-image"></i>
                        <span className="product-watermark-label">
                          {p.name || "Product Image"}
                        </span>
                      </div>
                    </div>
                    <div className="product-card-body">
                      <h3>{p.name}</h3>
                      <p title={p.shortDesc}>{p.shortDesc}</p>
                      <span className="product-link">
                        View Details <i className="fas fa-arrow-right fa-xs"></i>
                      </span>
                    </div>
                  </Link>
                  );
                })}
              </div>
            </div>

            {/* Floor 2: Global Reach */}
            <div className="lz-panel" id="lz-panel-2">
              <div className="lz-panel-tag">Third Floor · Global Reach</div>
              <div className="section-head" style={{ marginBottom: "1.5rem" }}>
                <h2 className="section-title">
                  Trusted across{" "}
                  <em style={{ fontStyle: "normal", color: "var(--teal)" }}>
                    Three
                  </em>{" "}
                  continents
                </h2>
              </div>
              <div
                className="reach-grid"
                style={{ gridTemplateColumns: "180px 1fr", gap: "2.5rem" }}
              >
                <div className="reach-stats stagger">
                  {[
                    { num: "7+", label: "Countries" },
                    { num: "2200+", label: "Projects" },
                    { num: "15+", label: "Export years" },
                    { num: "3", label: "Continents" },
                  ].map((s) => (
                    <div key={s.label} className="reach-stat">
                      <div className="reach-stat-num">{s.num}</div>
                      <div className="reach-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="map-container">
                    <div id="world-map"></div>
                  </div>
                  <div
                    className="region-pills"
                    style={{ marginTop: "0.75rem" }}
                  >
                    {[
                      "India",
                      "Nepal",
                      "Bangladesh",
                      "Sri Lanka",
                      "Omen",
                      "UAE",
                      "South Africa",
                      "Nigeria",
                      "Brazil",
                    ].map((r) => (
                      <span key={r} className="region-pill">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
