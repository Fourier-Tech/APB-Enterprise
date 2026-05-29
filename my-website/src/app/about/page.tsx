import Header from "@/components/Header";
import GlobalFooter from "@/components/GlobalFooter";
import { prisma } from "@/lib/db";
import styles from "./about.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import PageReadySignal from "@/components/PageReadySignal";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import { Logger } from "@/lib/logger";

export const revalidate = 0; // Dynamic Server Component to fetch the latest contacts

export default function AboutPage() {
  return (
    <>
      <Loader />
      <Header />
      <Suspense fallback={null}>
        <AsyncAboutContent />
      </Suspense>
    </>
  );
}

async function AsyncAboutContent() {

  try {

  } catch (error) {
    Logger.error("AboutPage", "Database query failed", error);
  }

  return (
    <>
      <ScrollReveal />
      <div className={styles["page-shell"]}>
        <main style={{ paddingTop: "72px" }}>
          {/* ── PAGE HERO ── */}
          <section className={styles["page-hero"]}>
            <div className={styles["page-hero-accent"]}></div>
            <div className={styles["page-hero-dots"]}></div>
            <div className="container">
              <div
                className={`${styles["page-hero-eyebrow"]} reveal`}
                data-reveal
                data-delay="0"
              >
                <span className={styles["eyebrow-line"]}></span>
                <span className={styles["eyebrow-text"]}>
                  About APB Enterprise
                </span>
              </div>
              <h1 data-reveal data-delay="100" className="reveal">
                Our story,
                <br />
                our <em>standards</em>.
              </h1>
              <p data-reveal data-delay="200" className="reveal">
                Built on precision. Backed by trust and engineering excellence
                in vertical transportation since 2018.
              </p>
            </div>
          </section>

          {/* ── WHO WE ARE ── */}
          <section className={styles.section}>
            <div className="container">
              <div className={styles["who-grid"]}>
                <div data-reveal data-delay="0" className="reveal">
                  <div className={styles["section-eyebrow"]}>Who we are</div>
                  <span className={styles["who-label"]}>Established 2018</span>
                </div>
                <div className={`${styles["who-body"]} stagger`} data-reveal>
                  <p>
                    We are proud to introduce our company as a trusted leader in the elevator manufacturing industry. Since 2018, we have been designing and manufacturing high-tech, cost-effective, and robust microcontroller-based elevator control systems.
                  </p>
                  <p>
                    Our highly skilled engineering team leverages innovative ideas and the latest technologies to deliver uncompromising quality. We are dedicated to providing exceptional service because we believe that our clients' success is the foundation of our own.
                  </p>
                  <p>
                    With deep expertise in vertical transportation, we develop tailored systems that meet the rigorous demands of the modern industry. Today, our products power elevators for clients across India and internationally, encompassing comprehensive control panels, associated circuit cards, and premium accessories.
                  </p>
                  <p>
                    Beyond product quality, APB places a strong emphasis on customer support. We strive to build long-lasting partnerships by listening to feedback, addressing technical requirements promptly, and consistently exceeding expectations.
                  </p>
                  <p
                    style={{ fontWeight: 600, borderLeftColor: "var(--teal)" }}
                  >
                    If you are looking for a reliable partner in the elevator industry, we are your <strong>one-stop destination</strong> for all vertical transport components.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── VISION & MISSION ── */}
          <section className={`${styles.section} ${styles["section-bg-off"]}`}>
            <div className="container">
              <div data-reveal data-delay="0" className="reveal">
                <div className={styles["section-eyebrow"]}>Direction</div>
                <div className={styles["section-title"]}>
                  Vision &amp; Mission
                </div>
              </div>
              <div className={`${styles["vm-grid"]} stagger`} data-reveal>
                <div className={styles["vm-card"]}>
                  <span className={styles["vm-bg-num"]}>01</span>
                  <div className={styles["vm-icon-wrap"]}>
                    <i className="fas fa-eye"></i>
                  </div>
                  <h3>Vision</h3>
                  <p className={styles["vm-subtitle"]}>Our Aim</p>
                  <p>
                    With a resolute determination to outdo our best performance,
                    we aim to stand at par with world leaders. We envision being
                    recognized as the most innovative organization across the
                    nation, providing premium systems that exceed industry
                    demands.
                  </p>
                </div>
                <div
                  className={`${styles["vm-card"]} ${styles["vm-card-alt"]}`}
                >
                  <span className={styles["vm-bg-num"]}>02</span>
                  <div className={styles["vm-icon-wrap"]}>
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <h3>Mission</h3>
                  <p className={styles["vm-subtitle"]}>Our Promise</p>
                  <p>
                    Our mission is to stay updated with the newest technology in
                    the international market and make the best use of it,
                    proposing fresh solutions to clients each time. We engineer
                    microcontroller chips and control boards that are highly
                    advanced, robust, and easy to deploy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── LEADERSHIP TEAM (2 PARTNERS LAYOUT) ── */}
          <section className={styles.section}>
            <div className="container">
              <div data-reveal data-delay="0" className="reveal">
                <div className={styles["section-eyebrow"]}>People</div>
                <div className={styles["section-title"]}>Leadership Team</div>
              </div>
              <div className={`${styles["team-grid"]} stagger`} data-reveal>
                {/* Card 1 — Managing Partner */}
                <div className={styles["team-card"]}>
                  <div className={styles["team-avatar-wrap"]}>
                    <div
                      className={`${styles["team-avatar"]} ${styles["team-avatar-teal"]}`}
                    >
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div
                      className={`${styles["team-avatar-ring"]} ${styles["team-avatar-ring-teal"]}`}
                    ></div>
                  </div>
                  <h3 className={styles["team-name"]}>Arvind Bhai Patel</h3>
                  <div className={styles["team-role"]}>Managing Partner</div>
                  <div className={styles["team-divider"]}></div>
                  <p className={styles["team-bio"]}>
                    Co-founder of APB Enterprise with over two decades of
                    expertise in elevator control systems. Leads the
                    company&apos;s overall vision, client relationships, and
                    business direction since 2018.
                  </p>
                </div>

                {/* Card 2 — Technical Partner */}
                <div className={styles["team-card"]}>
                  <div className={styles["team-avatar-wrap"]}>
                    <div
                      className={`${styles["team-avatar"]} ${styles["team-avatar-teal"]}`}
                    >
                      <i className="fas fa-microchip"></i>
                    </div>
                    <div
                      className={`${styles["team-avatar-ring"]} ${styles["team-avatar-ring-teal"]}`}
                    ></div>
                  </div>
                  <h3 className={styles["team-name"]}>Pradip Bhai Patel</h3>
                  <div className={styles["team-role"]}>Technical Partner</div>
                  <div className={styles["team-divider"]}></div>
                  <p className={styles["team-bio"]}>
                    The engineering mind behind every APB product line.
                    Specialises in microcontroller-based control systems &amp;
                    IoT integration for modern smart-building elevator
                    installations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── CERTIFICATIONS ── */}
          <section className={`${styles.section} ${styles["section-bg-off"]}`}>
            <div className="container">
              <div data-reveal data-delay="0" className="reveal">
                <div className={styles["section-eyebrow"]}>Quality</div>
                <div className={styles["section-title"]}>
                  Certifications &amp; Compliance
                </div>
              </div>
              <div className={`${styles["cert-pills"]} stagger`} data-reveal>
                <div className={styles["cert-pill"]}>
                  <i className="fas fa-certificate"></i> ISO 9001:2015 Certified
                </div>
                <div className={styles["cert-pill"]}>
                  <i className="fas fa-shield-alt"></i> EN81-20 / EN81-50
                  Standard
                </div>
                <div className={styles["cert-pill"]}>
                  <i className="fas fa-industry"></i> BIS Compliant
                </div>
                <div className={styles["cert-pill"]}>
                  <i className="fas fa-globe"></i> CE Standard Components
                </div>
              </div>
              <p
                className={`${styles["cert-note"]} reveal`}
                data-reveal
                data-delay="500"
              >
                * Compliance documents and certificate copies are available upon
                request. Contact our sales office for specific technical
                datasheets.
              </p>
            </div>
          </section>
        </main>
        <GlobalFooter />
      </div>
      <PageReadySignal />
    </>
  );
}

