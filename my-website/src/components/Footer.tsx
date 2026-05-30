import Link from "next/link";
import Image from "next/image";
import QuoteButton from "@/components/QuoteButton";

function fmtCat(cat: string): string {
  return cat
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface ContactData {
  address: string | null;
  addressUrl: string | null;
  phonePrimary: string | null;
  phoneSecondary: string | null;
  whatsappPrimary: string | null;
  whatsappSecondary: string | null;
  emailPrimary: string | null;
  emailSecondary: string | null;
  whatsappUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
}

export default function Footer({
  contact,
  categories = [],
  hideQuoteStrip = false,
}: {
  contact: ContactData | null;
  categories?: string[];
  hideQuoteStrip?: boolean;
}) {
  return (
    <>
      {/* ── WHATSAPP QUOTE STRIP — shown on every page ── */}
      {!hideQuoteStrip && (
        <section className="quote-strip">
          <div className="container">
            <h3>Need a custom solution for your elevator project?</h3>
            <p>
              Expert consultation, volume pricing, and tailored product designs.
            </p>
            <a
              href="/contact"
              rel="noopener noreferrer"
              className="btn-gold-cta"
            >
              Contact Us
            </a>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Image
                  src="/logo.jpg"
                  alt="APB Enterprise"
                  width={28}
                  height={28}
                  style={{ width: "auto", height: "auto" }}
                />
                <span className="logo-name" style={{ fontSize: "1rem" }}>
                  APB ENTERPRISE
                </span>
              </div>
              <p>
                Engineering trust since 2018 — precision components for modern
                vertical transportation. LLP registered.
              </p>
              {(() => {
                const socials = [
                  { url: contact?.linkedinUrl, icon: "fab fa-linkedin-in" },
                  { url: contact?.facebookUrl, icon: "fab fa-facebook-f" },
                  { url: contact?.instagramUrl, icon: "fab fa-instagram" },
                  { url: contact?.twitterUrl, icon: "fab fa-x-twitter" },
                  { url: contact?.youtubeUrl, icon: "fab fa-youtube" },
                ].filter((s) => s.url);

                return socials.length > 0 ? (
                  <div
                    className="footer-socials"
                    style={{ marginTop: "0.75rem" }}
                  >
                    {socials.map((s, i) => (
                      <a
                        key={i}
                        href={s.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className={s.icon}></i>
                      </a>
                    ))}
                  </div>
                ) : null;
              })()}
            </div>

            {/* Navigation */}
            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/products">Products</Link>
                </li>
                <li>
                  <Link href="/brochures">Brochures</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div className="footer-col">
              <h4>Products</h4>
              <ul>
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link href={`/products?category=${encodeURIComponent(cat)}`}>
                      {fmtCat(cat)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/products" style={{ color: "var(--teal)", fontWeight: 600 }}>
                    View Full <i className="fas fa-arrow-right" style={{ fontSize: "0.75rem", marginLeft: "4px" }}></i>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col footer-col--contact">
              <style>{`
                .footer-col--contact .footer-contact-item { cursor: default; }
                .footer-col--contact .footer-contact-item i { transition: color 0.2s ease, transform 0.2s ease; }
                .footer-col--contact .footer-contact-item:hover i { color: var(--teal); transform: scale(1.15); }
                .footer-col--contact .footer-contact-item a { transition: color 0.2s ease; }
                .footer-col--contact .footer-contact-item:hover a { color: var(--teal); }
              `}</style>
              <h4>Contact</h4>
              <div className="footer-contact-item">
                <i className="fas fa-phone-alt"></i>
                <a
                  href={
                    contact?.phonePrimary
                      ? `tel:${contact.phonePrimary.replace(/\s+/g, "")}`
                      : "tel:+918460348566"
                  }
                >
                  {contact?.phonePrimary ?? "+91 84603 48566"}
                </a>
              </div>
              <div className="footer-contact-item">
                <i className="fas fa-envelope"></i>
                <a
                  href={
                    contact?.emailPrimary
                      ? `mailto:${contact.emailPrimary}`
                      : "mailto:apbenterprise1@gmail.com"
                  }
                >
                  {contact?.emailPrimary ?? "apbenterprise1@gmail.com"}
                </a>
              </div>
              <div className="footer-contact-item">
                <i className="fas fa-map-marker-alt"></i>
                {contact?.addressUrl && contact?.address ? (
                  <a
                    href={contact.addressUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.address}
                  </a>
                ) : (
                  <a
                    href="https://maps.google.com/?q=Fortune+Industrial+Estate+Kathwada+Ahmedabad"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Fortune Industrial Estate, Ahmedabad
                  </a>
                )}
              </div>

              {/* Opens QuotePopup instead of direct WhatsApp link */}
              <QuoteButton
                label="WhatsApp us"
                className="btn-outline-teal"
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.78rem",
                  padding: "5px 12px",
                }}
              />
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <style>{`
              .footer-legal-link {
                color: var(--gray-mid);
                text-decoration: none;
                transition: color 0.2s ease;
              }
              .footer-legal-link:hover {
                color: var(--teal);
              }
            `}</style>
            <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.75rem" }}>
              <Link href="/privacy-policy" className="footer-legal-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-legal-link">Terms & Conditions</Link>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--gray-mid)" }}>
              © {new Date().getFullYear()} APB ENTERPRISE. All rights reserved. |{" "}
              <a
                href="https://bizcard-production-a814.up.railway.app/BizCard/fouriertech"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-legal-link"
              >
                Built by FourierTech
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
