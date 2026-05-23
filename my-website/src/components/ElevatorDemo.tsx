"use client";

import { useEffect } from "react";

export default function ElevatorDemo() {
  useEffect(() => {
    const FLOORS = [
      { id: 3, label: "4", name: "Level 4", sub: "Offices" },
      { id: 2, label: "3", name: "Level 3", sub: "Offices" },
      { id: 1, label: "2", name: "Level 2", sub: "Commercial" },
      { id: 0, label: "G", name: "Ground", sub: "Lobby / Reception" },
    ];
    const FLOOR_HEIGHT = 82;

    let currentFloor = 0;
    let busy = false;
    const queue: number[] = [];

    const shaft = document.getElementById("shaft");
    const statusDot = document.getElementById("statusDot");
    const statusText = document.getElementById("statusText");
    const statusFloor = document.getElementById("statusFloor");
    const copDisplay = document.getElementById("copDisplay");
    const copBtnsEl = document.getElementById("copBtns");

    if (
      !shaft ||
      !statusDot ||
      !statusText ||
      !statusFloor ||
      !copDisplay ||
      !copBtnsEl
    )
      return;

    // Clear any existing children (React strict mode double-invoke guard)
    shaft.innerHTML = "";
    copBtnsEl.innerHTML = "";

    // ── Build floor rows ──
    FLOORS.forEach((f) => {
      const row = document.createElement("div");
      row.className = "floor-row";
      row.id = "floor-row-" + f.id;
      row.innerHTML = `
        <div class="floor-label" id="floor-label-${f.id}">${f.label}</div>
        <div class="floor-lobby">
          <div style="display:flex;align-items:center;overflow:hidden;flex-shrink:0;">
            <div class="floor-door-left"  id="lobby-dl-${f.id}"></div>
            <div class="floor-door-gap"></div>
            <div class="floor-door-right" id="lobby-dr-${f.id}"></div>
          </div>
          <div class="floor-info">
            <div class="floor-name">${f.name}</div>
            <div class="floor-sub">${f.sub}</div>
          </div>
          <button class="floor-call-btn" id="call-btn-${f.id}" title="Call elevator to ${f.name}">
            <i class="fas fa-arrow-up"></i>
          </button>
        </div>
      `;
      shaft.appendChild(row);
    });

    // ── Car overlay ──
    const carTrack = document.createElement("div");
    carTrack.className = "car-track";
    carTrack.innerHTML = `
      <div class="elevator-car" id="elevatorCar">
        <div class="car-top-bar"></div>
        <div class="car-doors">
          <div class="car-door-left"  id="carDoorL"></div>
          <div class="car-door-right" id="carDoorR"></div>
        </div>
        <div class="car-inner"><span class="car-label">APB</span></div>
      </div>
    `;
    shaft.appendChild(carTrack);

    const elevatorCar = document.getElementById("elevatorCar")!;
    const carDoorL = document.getElementById("carDoorL")!;
    const carDoorR = document.getElementById("carDoorR")!;

    // ── Touch + click helper (no double-fire) ──
    function addTapHandler(el: HTMLElement, handler: () => void) {
      let touched = false;
      el.addEventListener(
        "touchstart",
        (e) => {
          touched = true;
          e.preventDefault();
          handler();
        },
        { passive: false },
      );
      el.addEventListener("click", () => {
        if (touched) {
          touched = false;
          return;
        }
        handler();
      });
    }

    // ── Build COP buttons ──
    FLOORS.forEach((f) => {
      const btn = document.createElement("button");
      btn.id = "cop-btn-" + f.id;
      btn.textContent = f.label;
      btn.title = "Go to " + f.name;
      btn.style.cssText = `
        width:26px; height:26px;
        border-radius:4px; border:none;
        cursor:pointer;
        font-family:'Space Grotesk',sans-serif;
        font-size:0.6rem; font-weight:700;
        color:rgba(255,255,255,0.55);
        background:rgba(255,255,255,0.1);
        transition:background 0.2s, color 0.2s, box-shadow 0.2s;
        display:flex; align-items:center; justify-content:center;
        -webkit-tap-highlight-color:transparent;
      `;
      btn.onmouseenter = () => {
        if (!btn.classList.contains("lit"))
          btn.style.background = "rgba(255,255,255,0.18)";
      };
      btn.onmouseleave = () => {
        if (!btn.classList.contains("lit"))
          btn.style.background = "rgba(255,255,255,0.1)";
      };
      addTapHandler(btn, () => requestFloor(f.id));
      copBtnsEl.appendChild(btn);
    });

    // ── Call button listeners ──
    FLOORS.forEach((f) => {
      const btn = document.getElementById("call-btn-" + f.id);
      if (btn) addTapHandler(btn as HTMLElement, () => requestFloor(f.id));
    });

    // ── Helpers ──
    function floorTop(floorId: number) {
      const visualIdx = FLOORS.length - 1 - floorId;
      return visualIdx * FLOOR_HEIGHT + (FLOOR_HEIGHT - 76) / 2;
    }

    function setCarPosition(floorId: number, animate: boolean) {
      elevatorCar.style.transition = animate
        ? "top 0.9s cubic-bezier(0.4,0,0.2,1)"
        : "none";
      elevatorCar.style.top = floorTop(floorId) + "px";
    }

    function setStatus(text: string, moving: boolean) {
      statusText!.textContent = text;
      statusDot!.className = "status-dot" + (moving ? "" : " idle");
    }

    function updateFloorLabels(active: number) {
      FLOORS.forEach((f) => {
        const el = document.getElementById("floor-label-" + f.id);
        if (el)
          el.className =
            "floor-label" + (f.id === active ? " active-floor" : "");
      });
      const activeFloor = FLOORS.find((f) => f.id === active);
      copDisplay!.textContent = activeFloor?.label || "";
      statusFloor!.textContent = activeFloor?.label || "";
    }

    function setCallBtn(floorId: number, lit: boolean) {
      const btn = document.getElementById("call-btn-" + floorId);
      if (btn) btn.className = "floor-call-btn" + (lit ? " called" : "");
    }

    function setCopBtn(floorId: number, lit: boolean) {
      const btn = document.getElementById(
        "cop-btn-" + floorId,
      ) as HTMLButtonElement | null;
      if (!btn) return;
      if (lit) {
        btn.classList.add("lit");
        btn.style.background = "var(--gold)";
        btn.style.color = "var(--near-black)";
        btn.style.boxShadow = "0 0 8px rgba(212,168,0,0.5)";
      } else {
        btn.classList.remove("lit");
        btn.style.background = "rgba(255,255,255,0.1)";
        btn.style.color = "rgba(255,255,255,0.55)";
        btn.style.boxShadow = "none";
      }
    }

    let doorsOpenAtFloor: number | null = null;

    function openDoors(floorId: number) {
      return new Promise<void>((res) => {
        doorsOpenAtFloor = floorId;
        carDoorL.classList.add("open");
        carDoorR.classList.add("open");
        const dl = document.getElementById("lobby-dl-" + floorId);
        const dr = document.getElementById("lobby-dr-" + floorId);
        if (dl) dl.classList.add("open");
        if (dr) dr.classList.add("open");
        setTimeout(res, 550);
      });
    }

    function closeDoors() {
      return new Promise<void>((res) => {
        carDoorL.classList.remove("open");
        carDoorR.classList.remove("open");
        if (doorsOpenAtFloor !== null) {
          const dl = document.getElementById("lobby-dl-" + doorsOpenAtFloor);
          const dr = document.getElementById("lobby-dr-" + doorsOpenAtFloor);
          if (dl) dl.classList.remove("open");
          if (dr) dr.classList.remove("open");
          doorsOpenAtFloor = null;
        }
        setTimeout(res, 550);
      });
    }

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function processQueue() {
      if (busy || queue.length === 0) return;
      busy = true;
      const next = queue.shift()!;

      setCallBtn(next, false);
      setCopBtn(next, false);

      if (next === currentFloor) {
        setStatus("doors opening", true);
        await openDoors(currentFloor);
        setStatus("boarding...", false);
        await sleep(1800);
        setStatus("doors closing", true);
        await closeDoors();
      } else {
        if (doorsOpenAtFloor !== null) {
          setStatus("doors closing", true);
          await closeDoors();
          await sleep(150);
        }

        const dir = next > currentFloor ? "going up" : "going down";
        setStatus(dir, true);
        setCarPosition(next, true);

        const steps = Math.abs(next - currentFloor);
        const stepTime = 900 / steps;
        for (let i = 1; i <= steps; i++) {
          await sleep(stepTime);
          const mid = currentFloor + (next > currentFloor ? i : -i);
          updateFloorLabels(mid);
        }

        currentFloor = next;
        await sleep(100);
        setStatus("arrived — doors opening", true);
        await openDoors(currentFloor);
        setStatus("boarding...", false);
        await sleep(1800);
        setStatus("doors closing", true);
        await closeDoors();
      }

      updateFloorLabels(currentFloor);
      setStatus("ready", false);
      busy = false;
      if (queue.length > 0) processQueue();
    }

    function requestFloor(floorId: number) {
      if (!queue.includes(floorId) && floorId !== currentFloor) {
        queue.push(floorId);
        setCallBtn(floorId, true);
        setCopBtn(floorId, true);
      }
      processQueue();
    }

    // ── Init ──
    setCarPosition(currentFloor, false);
    updateFloorLabels(currentFloor);
    setStatus("ready", false);

    // Auto demo
    const t1 = setTimeout(() => requestFloor(2), 2000);
    const t2 = setTimeout(() => requestFloor(3), 5000);
    const t3 = setTimeout(() => requestFloor(0), 9000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="elevator-demo">
      <div style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
        {/* Shaft + status bar */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="shaft-wrap" id="shaft"></div>
          <div className="shaft-status">
            <div className="status-dot idle" id="statusDot"></div>
            <span className="status-text" id="statusText">
              ready
            </span>
            <span className="status-floor" id="statusFloor">
              G
            </span>
          </div>
        </div>

        {/* COP Panel */}
        <div style={{ flexShrink: 0, marginLeft: "12px", marginTop: 0 }}>
          <div
            style={{
              background: "var(--near-black)",
              borderRadius: "6px",
              padding: "12px 9px 10px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              alignItems: "center",
              minWidth: "42px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "0.5rem",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              COP
            </div>

            <div
              id="copDisplay"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--gold)",
                background: "rgba(0,0,0,0.55)",
                padding: "4px 8px",
                borderRadius: "3px",
                minWidth: "28px",
                textAlign: "center",
                letterSpacing: "0.05em",
                border: "1px solid rgba(212,168,0,0.2)",
              }}
            >
              G
            </div>

            <div
              id="copBtns"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                alignItems: "center",
              }}
            ></div>

            <div
              style={{
                width: "80%",
                height: "1px",
                background: "rgba(255,255,255,0.08)",
                margin: "1px 0",
              }}
            ></div>

            <div style={{ display: "flex", gap: "5px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="fas fa-bell"
                  style={{
                    fontSize: "0.42rem",
                    color: "rgba(255,255,255,0.28)",
                  }}
                ></i>
              </div>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="fas fa-arrows-left-right"
                  style={{
                    fontSize: "0.42rem",
                    color: "rgba(255,255,255,0.28)",
                  }}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-hint">
        <i className="fas fa-hand-pointer" style={{ color: "var(--gold)" }}></i>
        Click a floor button or COP panel to call the lift
      </div>
    </div>
  );
}
