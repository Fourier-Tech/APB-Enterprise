import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "120px", paddingBottom: "120px", minHeight: "60vh" }}>
        <div className="container">
          <div className="section-eyebrow">Products Catalog</div>
          <h1 className="section-title">Our Elevator Products</h1>
          <p style={{ marginTop: "20px", color: "var(--gray-dark)" }}>
            Coming soon. We are hard at work building this page to showcase our technical products, components, and controllers.
          </p>
        </div>
      </main>
      <Footer contact={null} />
    </>
  );
}
