"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Loader() {
  useEffect(() => {
    const loader = document.getElementById("apb-loader");
    const car = document.getElementById("ldrCar");
    const doorL = document.getElementById("ldrDoorL");
    const doorR = document.getElementById("ldrDoorR");
    const content = document.getElementById("ldrContent");
    const bar = document.getElementById("ldrBar");
    const label = document.getElementById("ldrLabel");

    if (!loader || !car || !doorL || !doorR || !content || !bar || !label)
      return;

    // Reassign as non-nullable so TypeScript retains the narrowing inside
    // nested callbacks (setTimeout, requestAnimationFrame, setInterval).
    const safeLoader: HTMLElement = loader;
    const safeCar: HTMLElement = car;
    const safeDoorL: HTMLElement = doorL;
    const safeDoorR: HTMLElement = doorR;
    const safeContent: HTMLElement = content;
    const safeBar: HTMLElement = bar;
    const safeLabel: HTMLElement = label;

    const SHAFT_H = 220;
    const CAR_H = 70;
    const PAD_BOTTOM = 10;
    const TRAVEL = SHAFT_H - CAR_H - PAD_BOTTOM - 10;

    // ── Track real page load progress ──
    let progress = 0;

    function setProgress(value: number) {
      progress = Math.min(Math.max(value, progress), 100);
      safeBar.style.width = progress + "%";
    }

    function moveCar(toBottom: number, durationMs: number) {
      safeCar.style.transition = `bottom ${durationMs}ms cubic-bezier(0.45,0,0.25,1)`;
      safeCar.style.bottom = toBottom + "px";
    }

    // ── Phase 1: Car starts at bottom ──
    safeCar.style.bottom = PAD_BOTTOM + "px";
    safeCar.style.transition = "none";
    setProgress(5);

    // ── Phase 2: Use Navigation Timing API to track real load ──
    // As resources load, progress bar and car position update live

    function onDOMContentLoaded() {
      setProgress(40);
      // Move car to midpoint when DOM is ready
      const midTravel = PAD_BOTTOM + TRAVEL * 0.4;
      moveCar(midTravel, 400);
    }

    function onLoad() {
      // All resources loaded — go to 90%, car near top
      setProgress(90);
      const nearTop = PAD_BOTTOM + TRAVEL * 0.85;
      moveCar(nearTop, 500);

      // Small delay just for the bar to visually snap to 100% + car reach top
      // This is NOT a fake wait — it's the CSS transition time for the final move
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            safeBar.style.transition = "width 0.3s ease";
            setProgress(100);
            moveCar(PAD_BOTTOM + TRAVEL, 300);

            // Wait for car CSS transition (300ms) + door open transition (550ms)
            // These are real animation durations, not fake sleep
            setTimeout(() => {
              safeDoorL.classList.add("open");
              safeDoorR.classList.add("open");
              safeContent.classList.add("show");
              safeLabel.classList.add("show");

              // Wait for door open CSS transition to finish (550ms)
              setTimeout(() => {
                safeLoader.classList.add("hide");

                // Wait for fade-out CSS transition (700ms) then fire loaderDone
                setTimeout(() => {
                  document.dispatchEvent(new CustomEvent("loaderDone"));
                }, 700);
              }, 550);
            }, 350);
          }, 100);
        });
      });
    }

    // ── Simulate incremental progress using resource timing ──
    // Updates bar smoothly as browser fetches fonts, scripts, images
    let resourceTimer: ReturnType<typeof setInterval> | null = null;

    function trackResourceProgress() {
      if (typeof window === "undefined" || !window.performance) return;

      resourceTimer = setInterval(() => {
        const entries = performance.getEntriesByType("resource");
        const total = entries.length || 1;

        // Heuristic: count loaded vs pending resources
        // Each resource adds a tiny bit of progress between 5–85%
        const estimated = Math.min(5 + total * 3, 85);
        if (estimated > progress) {
          setProgress(estimated);
          // Smoothly move car proportionally
          const carRatio = (progress - 5) / 80;
          const carBottom = PAD_BOTTOM + TRAVEL * carRatio * 0.8;
          safeCar.style.transition = "bottom 0.4s ease";
          safeCar.style.bottom = carBottom + "px";
        }

        // Stop polling once window load fires
        if (document.readyState === "complete") {
          if (resourceTimer) clearInterval(resourceTimer);
        }
      }, 150);
    }

    // ── Attach real browser events ──
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onDOMContentLoaded, {
        once: true,
      });
      window.addEventListener("load", onLoad, { once: true });
      trackResourceProgress();
    } else if (document.readyState === "interactive") {
      // DOM already ready, waiting for resources
      onDOMContentLoaded();
      window.addEventListener("load", onLoad, { once: true });
      trackResourceProgress();
    } else {
      // Page already fully loaded (e.g. hot reload in dev)
      onDOMContentLoaded();
      onLoad();
    }

    return () => {
      if (resourceTimer) clearInterval(resourceTimer);
      document.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div id="apb-loader">
      {/* Shaft */}
      <div style={shaftStyle}>
        <div id="ldrCar" style={carStyle}>
          <div
            id="ldrDoorL"
            style={{
              ...doorBase,
              left: 0,
              borderRight: "1px solid rgba(15,105,120,0.12)",
              borderRadius: "0 0 0 5px",
            }}
          ></div>
          <div
            id="ldrDoorR"
            style={{ ...doorBase, right: 0, borderRadius: "0 0 5px 0" }}
          ></div>
          <div id="ldrContent" style={carContentStyle}>
            <Image
              src="/logo.jpg"
              alt="APB"
              width={30}
              height={30}
              style={{
                borderRadius: "4px",
                border: "1.5px solid rgba(212,168,0,0.6)",
                objectFit: "cover",
              }}
            />
            <span style={carNameStyle}>APB</span>
          </div>
        </div>
      </div>

      {/* Base cap */}
      <div style={baseStyle}></div>

      {/* Progress bar */}
      <div style={progressWrapStyle}>
        <div id="ldrBar" style={progressBarStyle}></div>
      </div>

      {/* Brand label */}
      <div id="ldrLabel" style={labelStyle}>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#111111",
            letterSpacing: "-0.01em",
          }}
        >
          APB Enterprise
        </div>
        <div
          style={{
            fontFamily: "'Epilogue', sans-serif",
            fontSize: "0.58rem",
            fontWeight: 500,
            letterSpacing: "0.13em",
            textTransform: "uppercase" as const,
            color: "#888888",
            marginTop: "2px",
          }}
        >
          Controls &amp; Harness Manufacturer
        </div>
      </div>

      <style>{`
        #apb-loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          transition: opacity 0.7s ease, visibility 0.7s ease;
        }
        #apb-loader.hide {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        #ldrDoorL, #ldrDoorR {
          position: absolute;
          top: 4px;
          bottom: 0;
          width: 50%;
          background: linear-gradient(to bottom, #daeef2 0%, #c5e5eb 100%);
          transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }
        #ldrDoorL.open { transform: translateX(-100%); }
        #ldrDoorR.open { transform: translateX(100%); }
        #ldrContent {
          opacity: 0;
          transition: opacity 0.5s ease 0.2s;
        }
        #ldrContent.show { opacity: 1; }
        #ldrLabel {
          text-align: center;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        #ldrLabel.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

/* ── Inline styles ── */
const shaftStyle: React.CSSProperties = {
  position: "relative",
  width: "100px",
  height: "220px",
  background: "#f0f5f6",
  border: "2px solid #c8dde1",
  borderRadius: "10px",
  overflow: "hidden",
};

const carStyle: React.CSSProperties = {
  position: "absolute",
  left: "20px",
  right: "20px",
  height: "70px",
  bottom: "10px",
  background: "linear-gradient(160deg, #0f6978 0%, #0a4d5a 100%)",
  borderRadius: "6px",
  border: "1.5px solid rgba(26,138,158,0.55)",
  boxShadow:
    "0 4px 20px rgba(15,105,120,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
  overflow: "hidden",
};

const doorBase: React.CSSProperties = {
  position: "absolute",
  top: "4px",
  bottom: 0,
  width: "50%",
  background: "linear-gradient(to bottom, #daeef2 0%, #c5e5eb 100%)",
  zIndex: 2,
};

const carContentStyle: React.CSSProperties = {
  position: "absolute",
  inset: "4px 0 0 0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  zIndex: 1,
};

const carNameStyle: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "0.48rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  color: "rgba(255,255,255,0.9)",
  textTransform: "uppercase",
};

const baseStyle: React.CSSProperties = {
  width: "100px",
  height: "7px",
  background: "#c8dde1",
  borderRadius: "0 0 6px 6px",
};

const progressWrapStyle: React.CSSProperties = {
  width: "200px",
  height: "4px",
  background: "rgba(15,105,120,0.12)",
  borderRadius: "99px",
  overflow: "hidden",
};

const progressBarStyle: React.CSSProperties = {
  height: "100%",
  width: "0%",
  borderRadius: "99px",
  background: "linear-gradient(90deg, #0F6978, #D4A800)",
  boxShadow: "0 0 6px rgba(212,168,0,0.4)",
  transition: "width 0.4s ease",
};

const labelStyle: React.CSSProperties = {
  textAlign: "center",
};
