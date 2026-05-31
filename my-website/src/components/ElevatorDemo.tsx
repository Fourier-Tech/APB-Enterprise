"use client";

import { useEffect, useRef, useState } from "react";

const FLOORS = [
  { id: 3, label: "3", name: "Floor 3", sub: "Executive Offices" },
  { id: 2, label: "2", name: "Floor 2", sub: "Corporate Offices" },
  { id: 1, label: "1", name: "Floor 1", sub: "Commercial" },
  { id: 0, label: "G", name: "Ground", sub: "Lobby · Reception" },
];

const FH = 96,
  CAR_H = 84,
  DOOR_MS = 620,
  DWELL = 1800,
  TPF = 1050;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ElevatorDemo() {
  const [carTop, setCarTop] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [animSteps, setAnimSteps] = useState(1);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [openAtFloor, setOpenAtFloor] = useState<number | null>(null);
  const [direction, setDirection] = useState<string | null>(null);
  const [status, setStatus] = useState("ready");
  const [displayFloor, setDisplayFloor] = useState(0);
  const [litCop, setLitCop] = useState<number[]>([]);
  const [litCall, setLitCall] = useState<number[]>([]);
  const [copArrow, setCopArrow] = useState<string | null>(null);
  const [chime, setChime] = useState(false);

  const busyRef = useRef(false);
  const currentFloorRef = useRef(0);
  // pendingRef holds ALL requested floors not yet visited
  const pendingRef = useRef<number[]>([]);
  // travelDir: current sweep direction; null = idle
  const travelDirRef = useRef<"up" | "down" | null>(null);
  const openAtFloorRef = useRef<number | null>(null);
  const doorsOpenRef = useRef(false);

  const floorTopPx = (id: number) =>
    (FLOORS.length - 1 - id) * FH + (FH - CAR_H) / 2;

  const triggerChime = () => {
    setChime(true);
    setTimeout(() => setChime(false), 550);
  };

  const openDoors = (floorId: number) =>
    new Promise<void>((res) => {
      openAtFloorRef.current = floorId;
      doorsOpenRef.current = true;
      setDoorsOpen(true);
      setOpenAtFloor(floorId);
      triggerChime();
      setTimeout(res, DOOR_MS);
    });

  const closeDoors = () =>
    new Promise<void>((res) => {
      doorsOpenRef.current = false;
      setDoorsOpen(false);
      setOpenAtFloor(null);
      openAtFloorRef.current = null;
      setTimeout(res, DOOR_MS);
    });

  /**
   * SCAN algorithm (like a real lift):
   * - While traveling UP  → serve the nearest floor ABOVE current first.
   *   When no more floors above, reverse and serve floors below.
   * - While traveling DOWN → serve the nearest floor BELOW current first.
   *   When no more floors below, reverse and serve floors above.
   * - If idle, pick direction toward the nearest pending floor.
   */
  function pickNext(cur: number, dir: "up" | "down" | null): number | null {
    const pending = pendingRef.current;
    if (pending.length === 0) return null;

    if (dir === "up") {
      const above = pending.filter((f) => f > cur).sort((a, b) => a - b);
      if (above.length > 0) return above[0];
      // nothing above – reverse
      const below = pending.filter((f) => f < cur).sort((a, b) => b - a);
      return below[0] ?? null;
    }

    if (dir === "down") {
      const below = pending.filter((f) => f < cur).sort((a, b) => b - a);
      if (below.length > 0) return below[0];
      // nothing below – reverse
      const above = pending.filter((f) => f > cur).sort((a, b) => a - b);
      return above[0] ?? null;
    }

    // Idle: go to nearest
    return pending.reduce((best, f) =>
      Math.abs(f - cur) < Math.abs(best - cur) ? f : best,
    );
  }

  async function runElevator() {
    if (busyRef.current) return;
    busyRef.current = true;

    while (pendingRef.current.length > 0) {
      const cur = currentFloorRef.current;
      const next = pickNext(cur, travelDirRef.current);
      if (next === null) break;

      // Remove this floor from pending
      pendingRef.current = pendingRef.current.filter((f) => f !== next);
      setLitCop((q) => q.filter((x) => x !== next));
      setLitCall((q) => q.filter((x) => x !== next));

      if (next === cur) {
        // Already here – just open
        setStatus("doors opening");
        await openDoors(cur);
        setStatus("boarding");
        await sleep(DWELL);
        setStatus("doors closing");
        await closeDoors();
      } else {
        if (doorsOpenRef.current) {
          setStatus("doors closing");
          await closeDoors();
          await sleep(180);
        }

        const dir: "up" | "down" = next > cur ? "up" : "down";
        travelDirRef.current = dir;
        setDirection(dir);
        setCopArrow(dir);
        setStatus(dir === "up" ? "going up ↑" : "going down ↓");

        const steps = Math.abs(next - cur);
        setAnimSteps(steps);
        setAnimating(true);
        setCarTop(floorTopPx(next));

        for (let i = 1; i <= steps; i++) {
          await sleep(TPF);
          const mid = cur + (dir === "up" ? i : -i);
          setDisplayFloor(mid);
        }

        currentFloorRef.current = next;
        setAnimating(false);
        await sleep(130);
        setDirection(null);
        setCopArrow(null);
        setStatus("arrived · doors opening");
        await openDoors(next);
        setStatus("boarding");
        await sleep(DWELL);
        setStatus("doors closing");
        await closeDoors();
      }

      setDisplayFloor(currentFloorRef.current);
      setCarTop(floorTopPx(currentFloorRef.current));
    }

    // All done
    travelDirRef.current = null;
    setDirection(null);
    setCopArrow(null);
    setStatus("ready");
    busyRef.current = false;
  }

  function requestFloor(floorId: number) {
    // Ignore if already pending or currently at that floor
    if (
      pendingRef.current.includes(floorId) ||
      floorId === currentFloorRef.current
    ) {
      return;
    }
    pendingRef.current = [...pendingRef.current, floorId];
    setLitCop((q) => [...q, floorId]);
    setLitCall((q) => [...q, floorId]);
    runElevator();
  }

  useEffect(() => {
    setCarTop(floorTopPx(0));
    setDisplayFloor(0);
    // Auto demo sequence
    const t1 = setTimeout(() => requestFloor(2), 1800);
    const t2 = setTimeout(() => requestFloor(3), 3000);
    const t3 = setTimeout(() => requestFloor(0), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const displayLabel = FLOORS.find((f) => f.id === displayFloor)?.label || "G";
  const isIdle = status === "ready";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          width: "100%",
          maxWidth: 400,
        }}
      >
        {/* ── Shaft ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              position: "relative",
              height: FLOORS.length * FH,
              background: "#ffffff",
              border: "1.5px solid #d0d5dd",
              borderRadius: "6px 6px 0 0",
              overflow: "hidden",
            }}
          >
            {FLOORS.map((f, i) => {
              const isActive = displayFloor === f.id;
              const isOpen = openAtFloor === f.id;
              return (
                <div
                  key={f.id}
                  style={{
                    position: "absolute",
                    top: i * FH,
                    left: 0,
                    right: 0,
                    height: FH,
                    display: "flex",
                    alignItems: "stretch",
                    borderBottom:
                      i < FLOORS.length - 1 ? "1px solid #e4e7ec" : "none",
                    zIndex: 2,
                  }}
                >
                  {/* Floor label */}
                  <div
                    style={{
                      width: 38,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: isActive ? "#0f6978" : "#667085",
                      background: isActive ? "#e6f4f6" : "#f9fafb",
                      borderRight: "1px solid #e4e7ec",
                      transition: "color 0.3s, background 0.3s",
                      letterSpacing: "0.04em",
                      zIndex: 2,
                    }}
                  >
                    {f.label}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 10px",
                      gap: 10,
                      background: "#ffffff",
                    }}
                  >
                    {/* Door frame */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                        height: 68,
                        overflow: "hidden",
                        borderRadius: 3,
                        border: "1px solid #d0d5dd",
                        background: "#c8cdd4",
                        position: "relative",
                      }}
                    >
                      {(["left", "right"] as const).map((side) => (
                        <div
                          key={side}
                          style={{
                            width: 28,
                            height: "100%",
                            flexShrink: 0,
                            background:
                              "linear-gradient(155deg,#e8ecf0 0%,#c8cdd4 55%,#adb3bc 100%)",
                            borderRight:
                              side === "left" ? "1px solid #b0b7c0" : "none",
                            borderLeft:
                              side === "right" ? "1px solid #b0b7c0" : "none",
                            transform: isOpen
                              ? `translateX(${side === "left" ? "-100%" : "100%"})`
                              : "translateX(0)",
                            transition: `transform ${DOOR_MS}ms cubic-bezier(0.4,0,0.2,1)`,
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "12%",
                              bottom: "12%",
                              [side === "left" ? "right" : "left"]: 5,
                              width: 1,
                              background: "#ffffff60",
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Floor info */}
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        opacity: isOpen ? 0 : 1,
                        transition: "opacity 0.3s",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-space-grotesk), sans-serif",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#101828",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {f.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-space-grotesk), sans-serif",
                          fontSize: 10,
                          color: "#667085",
                          marginTop: 2,
                        }}
                      >
                        {f.sub}
                      </div>
                    </div>

                    {/* Call button */}
                    <button
                      onClick={() => requestFloor(f.id)}
                      title={`Call to ${f.name}`}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        border: litCall.includes(f.id)
                          ? "1.5px solid #d4a800"
                          : "1.5px solid #d0d5dd",
                        background: litCall.includes(f.id)
                          ? "#d4a800"
                          : "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "all 0.18s",
                        boxShadow: litCall.includes(f.id)
                          ? "0 0 7px #d4a80066"
                          : "none",
                        opacity: isOpen ? 0 : 1,
                        pointerEvents: isOpen ? "none" : "auto",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: litCall.includes(f.id) ? "#1c1c1c" : "#667085",
                          lineHeight: 1,
                        }}
                      >
                        ▲
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Elevator car */}
            {carTop !== null && (
              <div
                style={{
                  position: "absolute",
                  left: 38,
                  right: 8,
                  height: CAR_H,
                  top: carTop,
                  transition: animating
                    ? `top ${animSteps * TPF}ms cubic-bezier(0.45,0,0.12,1)`
                    : "none",
                  zIndex: 6,
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "2px solid #0f6978",
                  boxShadow: "0 4px 18px #0f697833",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: "#0f6978",
                  }}
                />

                {/* Car door panels */}
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    overflow: "hidden",
                  }}
                >
                  {(["left", "right"] as const).map((side) => (
                    <div
                      key={side}
                      style={{
                        width: "50%",
                        height: "100%",
                        flexShrink: 0,
                        background:
                          "linear-gradient(150deg,#e6f4f6 0%,#cceaee 100%)",
                        borderRight:
                          side === "left" ? "1px solid #b2dce4" : "none",
                        transform: doorsOpen
                          ? `translateX(${side === "left" ? "-100%" : "100%"})`
                          : "translateX(0)",
                        transition: `transform ${DOOR_MS}ms cubic-bezier(0.4,0,0.2,1)`,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "18%",
                          bottom: "18%",
                          [side === "left" ? "right" : "left"]: 7,
                          width: 1.5,
                          background: "#0f697826",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Interior */}
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    pointerEvents: "none",
                    zIndex: 7,
                  }}
                >
                  {direction && (
                    <div
                      style={{
                        fontSize: 15,
                        color: "#0f6978",
                        lineHeight: 1,
                        animation:
                          "arrowBounce 0.6s ease-in-out infinite alternate",
                      }}
                    >
                      {direction === "up" ? "▲" : "▼"}
                    </div>
                  )}
                  {doorsOpen && (
                    <div
                      style={{
                        fontFamily: "var(--font-space-grotesk), sans-serif",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        color: "#0f6978",
                        textTransform: "uppercase",
                        background: "#e6f4f6",
                        padding: "3px 8px",
                        borderRadius: 3,
                        border: "1px solid #b2dce4",
                        animation: "fadeInAPB 0.3s ease",
                      }}
                    >
                      APB
                    </div>
                  )}
                </div>

                {chime && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "#0f697826",
                      animation: "chimeFade 0.5s ease-out forwards",
                      pointerEvents: "none",
                      zIndex: 10,
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Status bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              background: "#1c2434",
              borderRadius: "0 0 6px 6px",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: isIdle ? "#4b5565" : "#d4a800",
                animation: isIdle ? "none" : "pulse 1.4s infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 9,
                color: "#8a94a6",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {status}
            </span>
          </div>
        </div>

        {/* ── COP Panel ── */}
        <div
          style={{
            flexShrink: 0,
            background: "#1c2434",
            borderRadius: 6,
            padding: "14px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 7,
            minWidth: 48,
            boxShadow: "0 4px 18px #00000033",
            border: "1px solid #2e3849",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 7,
              color: "#8a94a6",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            COP
          </div>

          <div
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: 19,
              fontWeight: 700,
              color: "#d4a800",
              background: "#111827",
              padding: "5px 9px",
              borderRadius: 3,
              minWidth: 32,
              textAlign: "center",
              letterSpacing: "0.04em",
              border: "1px solid #2e3849",
            }}
          >
            {displayLabel}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: copArrow === "up" ? "#d4a800" : "#3d4a5c",
                transition: "color 0.2s",
              }}
            >
              ▲
            </div>
            <div
              style={{
                fontSize: 10,
                color: copArrow === "down" ? "#d4a800" : "#3d4a5c",
                transition: "color 0.2s",
              }}
            >
              ▼
            </div>
          </div>

          <div style={{ width: "78%", height: 1, background: "#2e3849" }} />

          {FLOORS.map((f) => {
            const lit = litCop.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => requestFloor(f.id)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  border: lit ? "1.5px solid #d4a800" : "1.5px solid #2e3849",
                  cursor: "pointer",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: lit ? "#1c1c1c" : "#8a94a6",
                  background: lit ? "#d4a800" : "#253044",
                  transition: "all 0.18s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: lit ? "0 0 9px #d4a80070" : "none",
                }}
              >
                {f.label}
              </button>
            );
          })}

          <div style={{ width: "78%", height: 1, background: "#2e3849" }} />

          <div style={{ display: "flex", gap: 5 }}>
            {["🔔", "↔"].map((ic) => (
              <div
                key={ic}
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: "50%",
                  background: "#253044",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  color: "#4b5565",
                }}
              >
                {ic}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hint line (centered under the whole widget) ── */}
      <div
        style={{
          marginTop: 12,
          width: "100%",
          maxWidth: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: 10,
          color: "#8a94a6",
          letterSpacing: "0.06em",
        }}
      >
        <span style={{ color: "#d4a800", fontSize: 13 }}>⬆</span>
        Click a floor button or COP panel to call the lift
      </div>

      <style>{`
        @keyframes pulse        { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes arrowBounce  { 0%{transform:translateY(0)} 100%{transform:translateY(-4px)} }
        @keyframes fadeInAPB    { from{opacity:0;transform:scale(0.75)} to{opacity:1;transform:scale(1)} }
        @keyframes chimeFade    { 0%{opacity:1} 100%{opacity:0} }
      `}</style>
    </div>
  );
}
