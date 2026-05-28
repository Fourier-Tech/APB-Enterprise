import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import PageReadySignal from "@/components/PageReadySignal";

export default async function NotFound() {
  let contact = null;
  try {
    contact = await prisma.contact.findFirst();
  } catch (error) {
    console.error("Database query failed in NotFound:", error);
  }

  return (
    <>
      <Header />
      <ScrollReveal />
      <div id="page-wrapper" className="page-shell">
        <main
          style={{
            paddingTop: "72px",
            minHeight: "calc(100vh - 72px - 300px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <section className="container" style={{ textAlign: "center", padding: "5rem 1.25rem" }}>
            <div
              className="reveal"
              data-reveal
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "6rem",
                fontWeight: 700,
                color: "var(--teal)",
                lineHeight: 1,
                marginBottom: "1rem",
              }}
            >
              404
            </div>
            <h1 className="section-title reveal" data-reveal data-delay="100" style={{ marginBottom: "1rem" }}>
              Page Not Found
            </h1>
            <p
              className="reveal"
              data-reveal
              data-delay="200"
              style={{
                color: "var(--gray-mid)",
                maxWidth: "500px",
                margin: "0 auto 2.5rem",
                fontSize: "1.05rem",
              }}
            >
              The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
            </p>

            <div
              className="reveal"
              data-reveal
              data-delay="300"
              style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
            >
              <Link href="/" className="btn-primary">
                <i className="fas fa-home"></i> Go Back Home
              </Link>
              <Link href="/contact" className="btn-ghost">
                <i className="fas fa-envelope"></i> Contact Us
              </Link>
            </div>
          </section>
        </main>
        <Footer contact={contact} hideQuoteStrip={true} />
      </div>
      <PageReadySignal />
    </>
  );
}
