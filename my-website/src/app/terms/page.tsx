import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";
import PageReadySignal from "@/components/PageReadySignal";
import Loader from "@/components/Loader";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms & Conditions | APB Enterprise",
  description: "Read the Terms & Conditions for using APB Enterprise products and services.",
};

export default async function TermsPage() {
  let contact = null;
  try {
    contact = await prisma.contact.findFirst();
  } catch (error) {
    console.error("Database query failed in TermsPage:", error);
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
              Terms & Conditions
            </h1>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.9rem", marginBottom: "3rem" }}>
              Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>

            <div className="about-body">
              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                1. Agreement to Terms
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and <strong>APB Enterprise</strong>, concerning your access to and use of this website. By accessing the site, you acknowledge that you have read, understood, and agreed to be bound by all of these Terms and Conditions.
              </p>

              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                2. Intellectual Property Rights
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                The Site and all of its content, including but not limited to interactive brochures, technical specifications, product manuals, layout diagrams, source code, databases, website designs, audio, video, text, photographs, and graphics (collectively, the "Content") and the trademarks and logos contained therein (the "Marks") are the proprietary property of APB Enterprise. They are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or commercially exploit any technical drawings or manuals found on this site without our express written permission.
              </p>

              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                3. User Representations & Form Submissions
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                By using our Site to submit Quote Requests or Verified Reviews, you represent and warrant that: (1) all information you submit (including names, company roles, and mobile numbers) is true, accurate, current, and complete; (2) you have the legal capacity to comply with these Terms and Conditions; (3) you will not access the Site through automated or non-human means; and (4) you will not use the Site for any illegal or unauthorized purpose.
              </p>

              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                4. Professional Products and Specifications
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                APB Enterprise manufactures professional-grade elevator control panels, auto rescue devices (ARD), harnesses, and safety gears. All product information, technical data, and specifications provided on this website are intended exclusively for certified engineers, licensed elevator technicians, and professional procurement officers. 
                <br /><br />
                We reserve the right to modify or discontinue any product specification without notice to improve engineering reliability or function. While we strive for accuracy, we do not guarantee that the product details on the Site are entirely error-free or current at all times.
              </p>

              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                5. Assumption of Risk & Liability Exclusions
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                <strong>CRITICAL WARNING:</strong> Elevator components involve high-voltage electricity and critical life-safety mechanisms. The installation, calibration, and maintenance of any APB Enterprise component must be performed <strong>strictly by certified, licensed elevator professionals</strong> in accordance with local safety standards and building codes.
                <br /><br />
                By referencing our brochures or purchasing our components, you assume all risk associated with their application. In no event will APB Enterprise, its partners, engineers, or employees be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages—including property damage, personal injury, or lost profits—arising from the improper installation, misuse, or application of our products.
              </p>

              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                6. Governing Law and Disputes
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                These Terms shall be governed by and interpreted in accordance with the laws of India. APB Enterprise and you irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms, our products, or the use of this website.
              </p>

              <h2 style={{ fontSize: "1.4rem", color: "var(--teal)", marginBottom: "1rem", marginTop: "2rem" }}>
                7. Contact Us
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                To resolve a complaint regarding the Site, request official technical datasheets, or seek further clarification regarding these Terms, please contact us at:
                <br /><br />
                <strong>Email:</strong> <a href={`mailto:${email}`} style={{ color: "var(--gold)" }}>{email}</a>
              </p>
            </div>
          </section>
        </main>
        <Footer contact={contact} />
      </div>
      <PageReadySignal />
    </>
  );
}
