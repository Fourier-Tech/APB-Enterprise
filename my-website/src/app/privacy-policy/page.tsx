import { Metadata } from "next";
import Header from "@/components/Header";
import GlobalFooter from "@/components/GlobalFooter";
import { prisma } from "@/lib/db";
import PageReadySignal from "@/components/PageReadySignal";
import Loader from "@/components/Loader";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Privacy Policy - Data Protection Commitment",
  description:
    "Read APB Enterprise's privacy policy to understand how we protect, secure, and handle your business contact details and reviews.",
  openGraph: {
    title: "Privacy Policy | APB Enterprise",
    description:
      "Read APB Enterprise's privacy policy to understand how we protect, secure, and handle your business contact details and reviews.",
  },
};

export default async function PrivacyPolicyPage() {
  let contact = null;
  try {
    contact = await prisma.contact.findFirst();
  } catch (error) {
    console.error("Database query failed in PrivacyPolicyPage:", error);
  }

  const email = contact?.emailPrimary || "info@apbenterprise.com";

  return (
    <>
      <Loader />
      <Header />
      <div id="page-wrapper" className="page-shell">
        <main style={{ paddingTop: "72px" }}>
          <section className="container" style={{ padding: "4rem 1.25rem", maxWidth: "800px", margin: "0 auto" }}>
            <div className="section-eyebrow">Legal</div>
            <h1 className="section-title" style={{ marginBottom: "1rem" }}>
              Privacy Policy
            </h1>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.9rem", marginBottom: "3rem" }}>
              Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>

            <div className="about-body">
              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                1. Introduction
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Welcome to <strong>APB Enterprise</strong>. As a B2B manufacturer and trader of precision elevator components, we respect your privacy and are committed to protecting the business and personal data you share with us. This privacy policy explains exactly what data we collect, why we collect it, and how it is secured.
              </p>

              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                2. Data We Collect
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                We only collect data that is strictly necessary to provide you with accurate product quotes and to display verified feedback. Depending on how you interact with our website, we collect the following:
                <br /><br />
                <strong>Quote Requests:</strong> When you request a product quote, we collect your <strong>Full Name</strong>, <strong>Mobile Number</strong>, and your specific <strong>Message or Inquiry</strong>. We do not require an email address for quotes.<br /><br />
                <strong>Verified Reviews:</strong> When you submit a review, we collect your <strong>Full Name</strong>, <strong>Company Name</strong>, <strong>Position / Job Title</strong>, <strong>Service Location (City)</strong>, <strong>Rating</strong>, and <strong>Review Message</strong>. This data is collected strictly to verify the professional authenticity of the review.<br /><br />
                <strong>Technical Data:</strong> Our server infrastructure may temporarily log standard technical data such as your IP address and browser type to ensure the security and performance of our systems.
              </p>

              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                3. How We Use Your Data & WhatsApp Routing
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                The data you submit is used exclusively to facilitate direct B2B communication and fulfill your requests:
                <br /><br />
                - <strong>Quote Routing via WhatsApp:</strong> To provide the fastest possible service, quote submissions made on this website may be dynamically routed directly to the APB Enterprise sales team via WhatsApp. By submitting a quote request, you consent to your name, mobile number, and message being processed and forwarded to our official WhatsApp business number so our engineers can assist you promptly.<br />
                - <strong>Database Storage:</strong> Your inquiries and reviews are securely stored in our managed PostgreSQL database to maintain a record of your communication and to curate verified testimonials for our platform.<br />
                - <strong>Public Display:</strong> If you submit a verified review, the data provided (such as your name, company, position, and message) may be displayed publicly on our website to showcase client experiences.
              </p>

              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                4. Third-Party Sharing and Tracking
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                We maintain a strict policy against data monetization. We <strong>do not</strong> sell, trade, or share your data with third-party advertising networks. We <strong>do not</strong> use invasive tracking cookies or external analytics scripts (our interactive brochure viewer, for example, is entirely native and private).
                <br /><br />
                Your data is only shared with our trusted infrastructure providers (such as our secure database hosts) who are bound by confidentiality agreements to protect your information.
              </p>

              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                5. Security
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. Our website enforces strict Content Security Policies and uses secure server runtimes to protect your form submissions.
              </p>

              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                6. Contact Us
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                If you have any questions about this privacy policy, how your data is handled, or if you wish to request the removal of a verified review, please contact us at:
                <br /><br />
                <strong>Email:</strong> <a href={`mailto:${email}`} style={{ color: "var(--gold)" }}>{email}</a>
              </p>
            </div>
          </section>
        </main>
        <GlobalFooter hideQuoteStrip={true} />
      </div>
      <PageReadySignal />
    </>
  );
}

