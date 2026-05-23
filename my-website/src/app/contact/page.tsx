import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "120px", paddingBottom: "120px", minHeight: "60vh" }}>
        <div className="container">
          <div className="section-eyebrow">Contact Us</div>
          <h1 className="section-title">Get in Touch</h1>
          <p style={{ marginTop: "20px", color: "var(--gray-dark)" }}>
            Coming soon. We are hard at work building this page to offer interactive forms, direct emails, and support contacts.
          </p>
        </div>
      </main>
      <Footer contact={null} />
    </>
  );
}
