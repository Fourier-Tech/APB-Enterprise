import { Suspense } from "react";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import GlobalFooter from "@/components/GlobalFooter";
import ScrollReveal from "@/components/ScrollReveal";
import PageReadySignal from "@/components/PageReadySignal";
import ProductsCatalog from "@/components/ProductsCatalog";
import { prisma } from "@/lib/db";
import { Logger } from "@/lib/logger";
import styles from "./products.module.css";

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: "Products | APB Enterprise",
  description:
    "Browse APB Enterprise's full range of elevator controllers, door operators, safety gears, and integrated systems — engineered for extreme reliability.",
};

export default function ProductsPage() {
  return (
    <>
      <Loader />
      <Header />
      <Suspense fallback={null}>
        <AsyncProductsContent />
      </Suspense>
    </>
  );
}

async function AsyncProductsContent() {
  let products: any[] = [];
  

  try {
    const [rawProducts] = await Promise.all([
      prisma.product.findMany({
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      }),
      
    ]);
    
    products = rawProducts?.map(p => ({
      ...p,
      shortDesc: p.shortDesc ?? "",
      longDesc: p.longDesc ?? "",
      category: p.category ?? "",
      imageUrl: p.imageUrl ?? "",
      modelCode: p.modelCode ?? "",
      isFeatured: p.isFeatured ?? false,
      displayOrder: p.displayOrder ?? 0,
      createdAt: p.createdAt ?? new Date(),
    })) ?? [];
    
    
  } catch (error) {
    Logger.error("ProductsPage", "Database query failed", error);
  }

  return (
    <>
      <ScrollReveal />
      <div className="page-shell">
        <main style={{ paddingTop: "72px" }}>
          {/* ── PAGE HERO ── */}
          <section className={styles["page-hero"]}>
            <div className={styles["page-hero-accent"]} />
            <div className={styles["page-hero-dots"]} />
            <div className="container">
              <div
                className={`${styles["page-hero-eyebrow"]} reveal`}
                data-reveal
                data-delay="0"
              >
                <span className={styles["eyebrow-line"]} />
                <span className={styles["eyebrow-text"]}>Flagship Range</span>
              </div>
              <h1 data-reveal data-delay="100" className="reveal">
                Every component,
                <br />
                built to <em>last</em>.
              </h1>
              <p data-reveal data-delay="200" className="reveal">
                Engineered for reliability, built for the long run — controllers,
                door operators, safety gears, and more.
              </p>
            </div>
          </section>

          {/* ── PRODUCTS CATALOG (client: tabs + grid + detail) ── */}
          <ProductsCatalog products={products} />

        </main>

        <GlobalFooter />
      </div>
      <PageReadySignal />
    </>
  );
}

