import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BrochuresPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "120px", paddingBottom: "120px", minHeight: "60vh" }}>
        <div className="container">
          <div className="section-eyebrow">Brochures & Documents</div>
          <h1 className="section-title">Technical Documentation</h1>
          <p style={{ marginTop: "20px", color: "var(--gray-dark)" }}>
            Coming soon. Technical specifications, manuals, catalogs, and certificates will be downloadable here.
          </p>
        </div>
      </main>
      <Footer contact={null} />
    </>
  );
}
