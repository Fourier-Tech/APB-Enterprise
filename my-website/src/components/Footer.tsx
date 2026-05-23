import Link from "next/link";
import Image from "next/image";

interface ContactData {
  address: string;
  addressUrl: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappPrimary: string;
  whatsappSecondary: string;
  emailPrimary: string;
  emailSecondary: string;
  whatsappUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
}

export default function Footer({ contact }: { contact: ContactData | null }) {
  return (
    <>
      {/* ── WHATSAPP QUOTE STRIP — shown on every page ── */}
      <section className="quote-strip">
        <div className="container">
          <h3>Need a custom solution for your elevator project?</h3>
          <p>
            Expert consultation, volume pricing, and tailored product designs.
          </p>
          <a
            href={contact ? contact.whatsappUrl : "https://wa.me/918460348566"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-cta"
          >
            <i className="fab fa-whatsapp"></i> Contact us on WhatsApp
          </a>
        </div>
      </section>

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
                />
                <span className="logo-name" style={{ fontSize: "1rem" }}>
                  APB Enterprise
                </span>
              </div>
              <p>
                Engineering trust since 2018 — precision components for modern
                vertical transportation. LLP registered.
              </p>
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
                <li>
                  <Link href="/products">Door Operators</Link>
                </li>
                <li>
                  <Link href="/products">COP Panels</Link>
                </li>
                <li>
                  <Link href="/products">Safety Gears</Link>
                </li>
                <li>
                  <Link href="/products">Controllers</Link>
                </li>
                <li>
                  <Link href="/products">View all</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4>Contact</h4>
              <div className="footer-contact-item">
                <i className="fas fa-phone-alt"></i>
                <a href={contact ? `tel:${contact.phonePrimary.replace(/\s+/g, "")}` : "tel:+918460348566"}>
                  {contact ? contact.phonePrimary : "+91 84603 48566"}
                </a>
              </div>
              <div className="footer-contact-item">
                <i className="fas fa-envelope"></i>
                <a href={contact ? `mailto:${contact.emailPrimary}` : "mailto:apbenterprise1@gmail.com"}>
                  {contact ? contact.emailPrimary : "apbenterprise1@gmail.com"}
                </a>
              </div>
              <div className="footer-contact-item">
                <i className="fas fa-map-marker-alt"></i>
                {contact ? (
                  <a href={contact.addressUrl} target="_blank" rel="noopener noreferrer">
                    {contact.address}
                  </a>
                ) : (
                  <a href="https://maps.google.com/?q=Fortune+Industrial+Estate+Kathwada+Ahmedabad" target="_blank" rel="noopener noreferrer">
                    Fortune Industrial Estate, Ahmedabad
                  </a>
                )}
              </div>
              <a
                href={contact ? contact.whatsappUrl : "https://wa.me/918460348566"}
                className="btn-outline-teal"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.78rem",
                  padding: "5px 12px",
                  display: "inline-flex"
                }}
              >
                <i className="fab fa-whatsapp"></i> WhatsApp us
              </a>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} APB Enterprise LLP. All rights reserved.</p>
            <div className="footer-socials">
              <a
                href={contact ? contact.linkedinUrl || "https://linkedin.com" : "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href={contact ? contact.facebookUrl || "https://facebook.com" : "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href={contact ? contact.instagramUrl || "https://instagram.com" : "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
