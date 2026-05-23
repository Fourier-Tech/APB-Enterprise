"use client";

import { useEffect } from "react";
import styles from "./Loader.module.css";

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

    let progress = 0;

    function setProgress(value: number) {
      progress = Math.min(Math.max(value, progress), 100);
      safeBar.style.width = progress + "%";
    }

    function moveCar(toBottom: number, durationMs: number) {
      safeCar.style.transition = `bottom ${durationMs}ms cubic-bezier(0.45,0,0.25,1)`;
      safeCar.style.bottom = toBottom + "px";
    }

    safeCar.style.bottom = PAD_BOTTOM + "px";
    safeCar.style.transition = "none";
    setProgress(5);

    function onDOMContentLoaded() {
      setProgress(40);
      const midTravel = PAD_BOTTOM + TRAVEL * 0.4;
      moveCar(midTravel, 400);
    }

    function finishAnimation() {
      safeBar.style.transition = "width 0.3s ease";
      setProgress(100);
      moveCar(PAD_BOTTOM + TRAVEL, 300);

      setTimeout(() => {
        safeDoorL.classList.add("open");
        safeDoorR.classList.add("open");
        safeContent.classList.add("show");
        safeLabel.classList.add("show");

        setTimeout(() => {
          safeLoader.classList.add("hide");

          setTimeout(() => {
            (window as any).__loaderDone = true;
            document.dispatchEvent(new CustomEvent("loaderDone"));
          }, 700);
        }, 550);
      }, 350);
    }

    function checkAndFinish() {
      if ((window as any).__pageDataReady) {
        finishAnimation();
      } else {
        document.addEventListener("pageDataReady", finishAnimation, { once: true });
      }
    }

    function onLoad() {
      setProgress(90);
      const nearTop = PAD_BOTTOM + TRAVEL * 0.85;
      moveCar(nearTop, 500);

      setTimeout(() => {
        checkAndFinish();
      }, 500);
    }

    let resourceTimer: ReturnType<typeof setInterval> | null = null;

    function trackResourceProgress() {
      if (typeof window === "undefined" || !window.performance) return;

      resourceTimer = setInterval(() => {
        const entries = performance.getEntriesByType("resource");
        const total = entries.length || 1;
        const estimated = Math.min(5 + total * 3, 85);
        if (estimated > progress) {
          setProgress(estimated);
          const carRatio = (progress - 5) / 80;
          const carBottom = PAD_BOTTOM + TRAVEL * carRatio * 0.8;
          safeCar.style.transition = "bottom 0.4s ease";
          safeCar.style.bottom = carBottom + "px";
        }

        if (document.readyState === "complete") {
          if (resourceTimer) clearInterval(resourceTimer);
        }
      }, 150);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onDOMContentLoaded, {
        once: true,
      });
      window.addEventListener("load", onLoad, { once: true });
      trackResourceProgress();
    } else if (document.readyState === "interactive") {
      onDOMContentLoaded();
      window.addEventListener("load", onLoad, { once: true });
      trackResourceProgress();
    } else {
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
    <div id="apb-loader" className={styles["apb-loader"]}>
      {/* Shaft */}
      <div className={styles["ldr-shaft"]}>
        <div id="ldrCar" className={styles["ldr-car"]}>
          <div id="ldrDoorL" className={styles["ldr-door-l"]}></div>
          <div id="ldrDoorR" className={styles["ldr-door-r"]}></div>
          <div id="ldrContent" className={styles["ldr-car-content"]}>
            <img
              src="/logo.jpg"
              alt="APB"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "4px",
                border: "1.5px solid rgba(212,168,0,0.6)",
                objectFit: "cover",
              }}
            />
            <span className={styles["ldr-car-name"]}>APB</span>
          </div>
        </div>
      </div>

      {/* Base cap */}
      <div className={styles["ldr-base"]}></div>

      {/* Progress bar */}
      <div className={styles["ldr-progress-wrap"]}>
        <div id="ldrBar" className={styles["ldr-progress-bar"]}></div>
      </div>

      {/* Brand label */}
      <div id="ldrLabel" className={styles["ldr-label"]}>
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
            textTransform: "uppercase",
            color: "#888888",
            marginTop: "2px",
          }}
        >
          Controls &amp; Harness Manufacturer
        </div>
      </div>
    </div>
  );
}
