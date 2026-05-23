import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import ElevatorDemo from "@/components/ElevatorDemo";
import LiftZone from "@/components/LiftZone";
import HeroClient from "@/components/HeroClient";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function Home() {
  // Query business contacts and featured products directly on the server
  const contact = await prisma.contact.findFirst();
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "desc" }
    ],
    take: 4
  });

  return (
    <>
      <Loader />
      <Header />

      <div className="page-shell">
        <main>
          {/* ── HERO ── */}
          <section className="hero">
            <div className="hero-bg-circle"></div>
            <div className="hero-corner-tl"></div>
            <div className="hero-corner-br"></div>

            <div className="container hero-grid" style={{ paddingTop: "72px" }}>
              {/* Left — copy + stats */}
              <div>
                <div className="hero-eyebrow">
                  <span className="eyebrow-line"></span>
                  <span className="eyebrow-text">
                    Precision Elevator Components
                  </span>
                </div>

                <h1>
                  Parts that keep <em>elevators</em> moving.
                </h1>

                <p className="hero-desc">
                  APB Enterprise manufactures elevator controllers, door
                  operators, safety gears, and COP panels — engineered for
                  reliability, built for the long run.
                </p>

                <div className="hero-btns">
                  <Link href="/products" className="btn-primary">
                    <i className="fas fa-th-large"></i> View products
                  </Link>
                  <a
                    href={contact ? contact.whatsappUrl || "/contact" : "/contact"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    Get a quote <i className="fas fa-arrow-right fa-sm"></i>
                  </a>
                </div>

                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-num" data-count="25+">
                      25+
                    </div>
                    <div className="stat-label">Years</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-num" data-count="500+">
                      500+
                    </div>
                    <div className="stat-label">Projects</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-num">ISO</div>
                    <div className="stat-label">Certified</div>
                  </div>
                </div>
              </div>

              {/* Right — interactive elevator demo */}
              <ElevatorDemo />
            </div>
          </section>

          {/* ── LIFT ZONE (scroll-jacked building) ── */}
          <LiftZone featuredProducts={featuredProducts} />

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
    </>
  );
}
