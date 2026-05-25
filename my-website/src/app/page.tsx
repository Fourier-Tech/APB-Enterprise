import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import ElevatorDemo from "@/components/ElevatorDemo";
import LiftZone from "@/components/LiftZone";
import HeroClient from "@/components/HeroClient";
import PageReadySignal from "@/components/PageReadySignal";
import QuoteButton from "@/components/QuoteButton";
import FeedbackCarousel from "@/components/FeedbackCarousel";
import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "./page.module.css";

import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Loader />
      <Header />
      <Suspense fallback={null}>
        <AsyncPageContent />
      </Suspense>
    </>
  );
}

async function AsyncPageContent() {
  const contact = await prisma.contact.findFirst();
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    take: 4,
  });
  const featuredReviews = await prisma.review.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className={styles["page-shell"]}>
        <main>
          {/* ── HERO ── */}
          <section id="home-hero" className={styles.hero}>
            <div className={styles["hero-bg-circle"]}></div>
            <div className={styles["hero-corner-tl"]}></div>
            <div className={styles["hero-corner-br"]}></div>

            <div
              className={`container ${styles["hero-grid"]}`}
              style={{ paddingTop: "72px" }}
            >
              {/* Left — copy + stats */}
              <div>
                <div className={styles["hero-eyebrow"]}>
                  <span className={styles["eyebrow-line"]}></span>
                  <span className={styles["eyebrow-text"]}>
                    Precision Elevator Components
                  </span>
                </div>

                <h1>
                  Parts that keep <em>elevators</em> moving.
                </h1>

                <p className={styles["hero-desc"]}>
                  APB Enterprise manufactures elevator controllers, door
                  operators, safety gears, and COP panels — engineered for
                  reliability, built for the long run.
                </p>

                <div className={styles["hero-btns"]}>
                  <Link href="/products" className="btn-primary">
                    <i className="fas fa-th-large"></i> View products
                  </Link>
                  {/* Opens QuotePopup */}
                  <QuoteButton label="Get a quote" className="btn-ghost" />
                </div>

                <div className={styles["hero-stats"]}>
                  <div className={styles["stat-item"]}>
                    <div
                      className={`${styles["stat-num"]} stat-num`}
                      data-count="25+"
                    >
                      25+
                    </div>
                    <div className={styles["stat-label"]}>Years</div>
                  </div>
                  <div className={styles["stat-item"]}>
                    <div
                      className={`${styles["stat-num"]} stat-num`}
                      data-count="500+"
                    >
                      500+
                    </div>
                    <div className={styles["stat-label"]}>Projects</div>
                  </div>
                  <div className={styles["stat-item"]}>
                    <div className={`${styles["stat-num"]} stat-num`}>ISO</div>
                    <div className={styles["stat-label"]}>Certified</div>
                  </div>
                </div>
              </div>

              {/* Right — interactive elevator demo */}
              <ElevatorDemo />
            </div>
          </section>

          {/* ── LIFT ZONE (scroll-jacked building) ── */}
          <LiftZone featuredProducts={featuredProducts} />

          {/* ── CLIENT FEEDBACK ── */}
          {featuredReviews.length > 0 && (
            <section className="fc-section reveal">
              <div className="container">
                <FeedbackCarousel reviews={featuredReviews} />
              </div>
            </section>
          )}

          {/* ── BROCHURE STRIP ── */}
          <section className="brochure-section reveal">
            <div className="container brochure-inner">
              <div>
                <div className="brochure-label">Product catalogue</div>
                <div className="brochure-title">
                  Complete technical reference — all products
                </div>
                <div className="brochure-sub">
                  Specifications, dimensions, compliance documents in one PDF.
                </div>
              </div>
              <Link href="/brochures" className="btn-outline-teal">
                <i className="fas fa-download"></i> Download catalogue
              </Link>
            </div>
          </section>
        </main>

        <Footer contact={contact} />
      </div>

      {/* Client-side: hero→liftzone snap + scroll-reveal + counters */}
      <HeroClient />

      {/* Signals the loader that the async page is fully loaded */}
      <PageReadySignal />
    </>
  );
}
