import { Suspense } from "react";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import GlobalFooter from "@/components/GlobalFooter";
import ScrollReveal from "@/components/ScrollReveal";
import PageReadySignal from "@/components/PageReadySignal";
import { prisma } from "@/lib/db";
import QuoteWizard from "@/components/QuoteWizard";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact & Quote Engine | APB Enterprise",
  description:
    "Get in touch with APB Enterprise. Speak with our vertical transportation engineers, request specialized elevator wiring harness quote parameters, or customize control panel layouts.",
};

export default async function ContactPage() {
  return (
    <>
      <Loader />
      <Header />
      <Suspense fallback={null}>
        <AsyncContactContent />
      </Suspense>
    </>
  );
}

async function AsyncContactContent() {
  let contact = null;
  try {
    contact = await prisma.contact.findFirst();
  } catch (error) {
    console.error("Database query failed in ContactPage:", error);
  }

  // Establish fallback dynamic parameters
  const phone = contact?.phonePrimary ?? "+91 22 4098 1234";
  const email = contact?.emailPrimary ?? "sales@apbenterprise.com";
  const address = contact?.address ?? "Plot A-12, MIDC, Pune – 411018, India";
  const mapUrl = contact?.addressUrl ?? "https://maps.google.com/?q=Plot+A-12+MIDC+Pune+411018";
  const whatsapp = contact?.whatsappPrimary ?? "+91 99999 99999";

  return (
    <>
      <ScrollReveal />
      <div className="page-shell">
        <main style={{ paddingTop: "72px" }}>
          {/* ── PAGE HERO ── */}
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
                <span className={styles["eyebrow-text"]}>Get in Touch</span>
              </div>
              <h1 data-reveal data-delay="100" className="reveal">
                Contact us,
                <br />
                get a <em>quote</em>.
              </h1>
              <p data-reveal data-delay="200" className="reveal">
                Configure technical parameters via our interactive Quote Engine below. Submitting details compiles a
                structured spec sheet sent directly to our WhatsApp support team.
              </p>
            </div>
          </section>

          {/* MAIN TWO-COLUMN LAYOUT */}
          <section className={styles["contact-section"]}>
            <div className="container">
              <div className={styles["contact-split-grid"]}>
                {/* LEFT SIDE: PREMIUM DYNAMIC QUOTE WIZARD */}
                <div>
                  <QuoteWizard whatsappNumber={whatsapp} />
                </div>

                {/* RIGHT SIDE: DIRECT CONTACT DETAILS HUB */}
                <div className={styles["contact-info-hub"]}>

                  {/* Speak to Sales card */}
                  <div className={styles["info-card"]}>
                    <div className={styles["info-card-content"]}>
                      <div className={styles["info-card-icon"]}>
                        <i className="fas fa-phone-alt" />
                      </div>
                      <div className={styles["info-card-details"]}>
                        <h3>Call Us</h3>
                        <a href={`tel:${phone.replace(/\s+/g, "")}`} className={styles["info-card-value"]}>
                          {phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email card */}
                  <div className={styles["info-card"]}>
                    <div className={styles["info-card-content"]}>
                      <div className={styles["info-card-icon"]}>
                        <i className="fas fa-envelope" />
                      </div>
                      <div className={styles["info-card-details"]}>
                        <h3>Email Us</h3>
                        <a href={`mailto:${email}`} className={styles["info-card-value"]}>
                          {email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* HQ Address card - Entire card clickable */}
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles["hq-card"]}
                  >
                    <div className={styles["hq-card-header"]}>
                      <i className="fas fa-map-marker-alt" />
                      <h3>Location</h3>
                    </div>
                    <p className={styles["hq-address"]}>{address}</p>
                    <span className={styles["hq-link-btn"]}>
                      Get Directions <i className="fas fa-arrow-up-right-from-square" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <GlobalFooter hideQuoteStrip={true} />
      </div>
      <PageReadySignal />
    </>
  );
}

