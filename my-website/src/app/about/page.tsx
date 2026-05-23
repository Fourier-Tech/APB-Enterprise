import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "120px", paddingBottom: "120px", minHeight: "60vh" }}>
        <div className="container">
          <div className="section-eyebrow">About Us</div>
          <h1 className="section-title">About APB Enterprise</h1>
          <p style={{ marginTop: "20px", color: "var(--gray-dark)" }}>
            Coming soon. We are hard at work building this page to showcase our history, team, and values.
          </p>
        </div>
      </main>
      <Footer contact={null} />
    </>
  );
}
