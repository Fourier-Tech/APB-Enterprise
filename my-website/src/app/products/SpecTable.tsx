"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./products.module.css";

/* ── Parse longDesc pipe-separated spec lines ── */
function parseSpecs(longDesc: string | null): { key: string; val: string }[] {
  if (!longDesc) return [];
  return longDesc
    .split("|")
    .map((line) => {
      const idx = line.indexOf("=");
      if (idx === -1) return null;
      return {
        key: line.slice(0, idx).trim().replace(/\.$/, ""),
        val: line.slice(idx + 1).trim().replace(/\.$/, ""),
      };
    })
    .filter(Boolean) as { key: string; val: string }[];
}

export default function SpecTable({ longDesc }: { longDesc: string | null }) {
  const specs = parseSpecs(longDesc);
  const [expanded, setExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // If the content is taller than the max collapsed height (e.g., 180px), it needs collapse
      if (contentRef.current.scrollHeight > 180) {
        setNeedsCollapse(true);
      }
    }
  }, [specs]);

  if (specs.length === 0) return null;

  const handleToggle = () => {
    if (expanded) {
      // Collapsing — scroll the spec container into view so user doesn't land at footer
      setExpanded(false);
      requestAnimationFrame(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      setExpanded(true);
    }
  };

  return (
    <div className={styles["spec-container"]} ref={containerRef}>
      <div
        className={`${styles["spec-table-wrap"]} ${needsCollapse && !expanded ? styles["collapsed"] : ""}`}
        ref={contentRef}
      >
        <div className={styles["spec-table"]}>
          {specs.map((s, i) => (
            <div className={styles["spec-row"]} key={i}>
              <span className={styles["spec-key"]}>{s.key}</span>
              <span className={styles["spec-val"]}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {needsCollapse && (
        <button
          className={styles["spec-toggle-btn"]}
          onClick={handleToggle}
        >
          {expanded ? (
            <>Show Less <i className="fas fa-chevron-up" /></>
          ) : (
            <>Show More <i className="fas fa-chevron-down" /></>
          )}
        </button>
      )}
    </div>
  );
}
