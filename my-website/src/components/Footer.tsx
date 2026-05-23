import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      {/* ── WHATSAPP QUOTE STRIP — shown on every page ── */}
      <section className="quote-strip">
        <div className="container">
          <h3>Need a custom solution for your elevator project?</h3>
          <p>
            Expert consultation, volume pricing, and tailored product designs.
          </p>
          <Link href="/contact" className="btn-gold-cta">
            <i className="fab fa-whatsapp"></i> Contact us on WhatsApp
          </Link>
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
                  style={{ height: "28px", width: "auto" }}
                />
                <span className="logo-name" style={{ fontSize: "1rem" }}>
                  APB Enterprise
                </span>
              </div>
              <p>
                Engineering trust since 1998 — precision components for modern
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
                +91 22 4098 1234
              </div>
              <div className="footer-contact-item">
                <i className="fas fa-envelope"></i>
                sales@apbenterprise.com
              </div>
              <div className="footer-contact-item">
                <i className="fas fa-map-marker-alt"></i>
                Pune, Maharashtra, India
              </div>
              <Link
                href="/contact"
                className="btn-outline-teal"
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.78rem",
                  padding: "5px 12px",
                }}
              >
                <i className="fab fa-whatsapp"></i> WhatsApp us
              </Link>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <p>© 2025 APB Enterprise LLP. All rights reserved.</p>
            <div className="footer-socials">
              <a
                href="https://linkedin.com/company/apb-enterprise"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://facebook.com/apbenterprise"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://instagram.com/apbenterprise"
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
