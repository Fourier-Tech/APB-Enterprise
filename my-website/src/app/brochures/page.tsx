import { Metadata } from "next";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import GlobalFooter from "@/components/GlobalFooter";
import ScrollReveal from "@/components/ScrollReveal";
import PageReadySignal from "@/components/PageReadySignal";
import BrochuresCatalog from "@/components/BrochuresCatalog";
import { prisma } from "@/lib/db";
import { Logger } from "@/lib/logger";
import styles from "./brochures.module.css";

export const revalidate = 3600; // Cache page for an hour

export const metadata: Metadata = {
  title: "Download Brochures & Technical Resources",
  description:
    "Download technical brochures, wiring diagrams, installation manuals, and catalog sheets for APB Enterprise elevator control systems.",
  openGraph: {
    title: "Technical Brochures & Resource Catalog | APB Enterprise",
    description:
      "Download technical brochures, wiring diagrams, installation manuals, and catalog sheets for APB Enterprise elevator control systems.",
  },
  alternates: {
    canonical: "/brochures",
  },
};

export default function BrochuresPage() {
  return (
    <>
      <Loader />
      <Header />
      <Suspense fallback={null}>
        <AsyncBrochuresContent />
      </Suspense>
    </>
  );
}

async function AsyncBrochuresContent() {
  let dbBrochures: any[] = [];


  try {
    const [rawBrochures] = await Promise.all([
      prisma.brochure.findMany({
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
      }),

    ]);

    dbBrochures = rawBrochures?.map(b => ({
      ...b,
      title: b.title ?? "",
      fileUrl: b.fileUrl ?? "",
      isActive: b.isActive ?? false,
      displayOrder: b.displayOrder ?? 0,
      createdAt: b.createdAt ?? new Date(),
    })) ?? [];


  } catch (error) {
    Logger.error("BrochuresPage", "Database query failed", error);
  }

  return (
    <>
      <ScrollReveal />
      <div className="page-shell">
        <main style={{ paddingTop: "72px" }}>
          {/* ── DARK CINEMATIC HERO ── */}
          <section className={styles["page-hero"]}>
            <div className={styles["page-hero-accent"]} />
            <div className={styles["page-hero-dots"]} />
            <div className="container">
              <div
                className={`${styles["page-hero-eyebrow"]} reveal`}
                data-reveal
                data-delay="0"
              >
                <span className={styles["eyebrow-line"]} />
                <span className={styles["eyebrow-text"]}>Resources & Guides</span>
              </div>
              <h1 data-reveal data-delay="100" className="reveal">
                Technical <em>Brochures</em>
                <br />& Catalogues.
              </h1>
              <p data-reveal data-delay="200" className="reveal">
                Access step-by-step engineering diagrams, compliance standard documentation,
                and extensive product specifications.
              </p>
            </div>
          </section>

          {/* ── INTERACTIVE 3D CATALOG GRID ── */}
          <BrochuresCatalog dbBrochures={dbBrochures} />
        </main>

        <GlobalFooter />
      </div>
      <PageReadySignal />
    </>
  );
}

