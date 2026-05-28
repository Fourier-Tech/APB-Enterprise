import { Suspense } from "react";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import GlobalFooter from "@/components/GlobalFooter";
import ScrollReveal from "@/components/ScrollReveal";
import PageReadySignal from "@/components/PageReadySignal";
import BrochuresCatalog from "@/components/BrochuresCatalog";
import { prisma } from "@/lib/db";
import styles from "./brochures.module.css";

export const revalidate = 3600; // Cache page for an hour

export const metadata = {
  title: "Brochures & Resources | APB Enterprise",
  description:
    "Download APB Enterprise's technical brochures, installation manuals, certificates, and corporate catalog profiles.",
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
    console.error("Database query failed in BrochuresPage:", error);
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

