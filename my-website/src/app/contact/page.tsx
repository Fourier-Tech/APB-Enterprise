import { Suspense } from "react";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

// Real-time IST Status Calculation (India Standard Time: UTC + 5:30)
function getOfficeStatus() {
  const date = new Date();
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  const istDate = new Date(utcTime + 3600000 * 5.5);

  const currentHour = istDate.getHours();
  const currentDay = istDate.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday

  // Monday to Saturday, 9:00 AM (9) to 7:00 PM (19)
  const isOpen = currentDay >= 1 && currentDay <= 6 && currentHour >= 9 && currentHour < 19;

  return {
    isOpen,
    desc: isOpen
      ? "Our sales and engineering desk is active. Average response time: 2 hours."
      : "We are currently closed. Submit your spec sheet and we'll reply first thing in the morning.",
  };
}

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
  const contact = await prisma.contact.findFirst();
  const status = getOfficeStatus();

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

        <Footer contact={contact} />
      </div>
      <PageReadySignal />
    </>
  );
}
