"use client";

import { useState, useEffect } from "react";
import type { Brochure, Contact } from "@prisma/client";
import styles from "@/app/brochures/brochures.module.css";

interface Props {
  dbBrochures: Brochure[];
}

export default function BrochuresCatalog({ dbBrochures }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  // Handle modal toggling & scroll locking
  function openBook(title: string, fileUrl: string) {
    setModalTitle(title);
    setPdfUrl(fileUrl);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeBook() {
    setModalOpen(false);
    document.body.style.overflow = "";
    setTimeout(() => {
      setPdfUrl("");
    }, 350);
  }

  // Listen for Escape key to close modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeBook();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Center the grid beautifully if there's only 1 brochure
  const gridStyle =
    dbBrochures.length === 1
      ? { maxWidth: "320px", margin: "0 auto" }
      : {};

  return (
    <>
      <section className={styles["brochures-section"]}>
        <div className="container">
          <div className={styles["section-label"]} data-reveal>
            <span className={styles["eyebrow-line"]} />
            Our Publications
          </div>
          <h2 className={styles["section-title"]} data-reveal data-delay="100">
            Browse & Live Preview
          </h2>

          <div className={styles["books-grid"]} style={gridStyle}>
            {/* ── DYNAMIC CATALOGUES DIRECT FROM NEON POSTGRES DATABASE ── */}
            {dbBrochures.map((b, idx) => {
              // Rotate dynamically through book themes: Teal (1), Gold (2), Dark (3), Light (4)
              const themeNum = (idx % 4) + 1;
              const themeClass = styles[`book-${themeNum}`];

              return (
                <div
                  key={b.id}
                  className={`${styles["book-card"]} ${themeClass}`}
                  onClick={() => openBook(b.title ?? "", b.fileUrl ?? "")}
                >
                  <div className={styles["book-cover"]}>
                    <div className={styles["book-spine"]} />
                    <div className={styles["book-pages"]} />
                    <div className={styles["book-front"]}>
                      <div className={styles["book-cover-img"]}>
                        <span className={styles["book-tag"]}>Official</span>
                        <div className={styles["book-title"]}>{b.title ?? ""}</div>
                        <div className={styles["book-subtitle"]}>
                          Official APB product catalogue, specifications, and full technical layout documentation.
                        </div>
                        <div className={styles["book-meta"]}>
                          <span className={styles["book-meta-year"]}>APB Enterprise</span>
                          <i className="fas fa-book-open styles.book-icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles["book-info"]}>
                    <h3>{b.title ?? ""}</h3>
                    <p>Dynamic Vector Preview</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PREMIUM INTERACTIVE MODAL OVERLAY WITH NATIVE VECTOR PDF ── */}
      <div
        className={`${styles["modal-overlay"]} ${modalOpen ? styles["open"] : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeBook();
        }}
      >
        <div className={styles["flipbook-wrap"]}>
          {/* Topbar navigation panel */}
          <div className={styles["flipbook-topbar"]}>
            <span className={styles["flipbook-topbar-title"]}>{modalTitle}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <button className={styles["flipbook-close"]} onClick={closeBook}>
                <i className="fas fa-times" />
              </button>
            </div>
          </div>

          {/* Premium Native Vector PDF Viewer inside custom modal wrapper */}
          <div className={styles["pdf-stage-row"]}>
            {pdfUrl && (
              <iframe
                title={modalTitle}
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                className={styles["pdf-iframe"]}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
