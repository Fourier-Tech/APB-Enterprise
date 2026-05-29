import { Suspense } from "react";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import GlobalFooter from "@/components/GlobalFooter";
import PageReadySignal from "@/components/PageReadySignal";
import { prisma } from "@/lib/db";
import styles from "../products.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import SpecTable from "../SpecTable";

import { Logger } from "@/lib/logger";

export const revalidate = 3600;

async function findProductByCode(code: string) {
  const queryStart = performance.now();
  const context = "products/[code]";
  Logger.info(context, `Querying product for code: "${code}"`);

  try {
    // Try modelCode first, fall back to numeric id
    const byCode = await prisma.product.findFirst({
      where: { modelCode: code },
    });
    if (byCode) {
      Logger.perf(context, `Product found by modelCode: "${code}"`, performance.now() - queryStart);
      return byCode;
    }

    const numId = parseInt(code, 10);
    if (!isNaN(numId)) {
      const byId = await prisma.product.findUnique({ where: { id: numId } });
      if (byId) {
        Logger.perf(context, `Product found by ID fallback: ${numId}`, performance.now() - queryStart);
        return byId;
      }
    }

    Logger.warn(context, `Product NOT found for code/ID: "${code}" (duration: ${(performance.now() - queryStart).toFixed(1)}ms). Returning null.`);
  } catch (error) {
    Logger.error(context, `Database query failed in findProductByCode for "${code}" after ${(performance.now() - queryStart).toFixed(1)}ms`, error);
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const product = await findProductByCode(decodeURIComponent(code));
  if (!product) return { title: "Product Not Found | APB Enterprise" };
  return {
    title: `${product.name} | APB Enterprise`,
    description: product.shortDesc ?? "",
  };
}

/* ── Icon map by category ── */
const CATEGORY_ICONS: Record<string, string> = {
  "geared controller": "fa-microchip",
  "gearless controller": "fa-bolt",
  "monarch integrated controller": "fa-network-wired",
  "hydraulic controller": "fa-water",
  "goods lift controller": "fa-box-open",
};

function getCategoryIcon(cat: string): string {
  return CATEGORY_ICONS[cat.toLowerCase()] ?? "fa-cog";
}

export default async function ProductDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  return (
    <>
      <Loader />
      <Header />
      <Suspense fallback={null}>
        <AsyncProductDetail code={decodeURIComponent(code)} />
      </Suspense>
    </>
  );
}

async function AsyncProductDetail({ code }: { code: string }) {
  const product = await findProductByCode(code);
  let contact = null;
  try {
    contact = await prisma.contact.findFirst();
  } catch (error) {
    console.error("Database query failed for contact in AsyncProductDetail:", error);
  }

  if (!product) {
    notFound();
  }

  const icon = getCategoryIcon(product.category ?? "");

  // Build WhatsApp URL
  const base = contact?.whatsappPrimary ?? "";
  const number = base.replace(/\D/g, "");
  const msg = `Hi APB Enterprise team, I am interested in your product "${product.name}" (Model: ${product.modelCode ?? "N/A"}). Could you please share the price and technical specifications?`;
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;

  return (
    <>
      <div className="page-shell">
        <main style={{ paddingTop: "72px" }}>
          <section className={styles["detail-section"]}>
            <div className="container">
              <Link href="/products" className={styles["back-btn"]}>
                <i className="fas fa-arrow-left" />
                Back to all products
              </Link>

              <div className={styles["detail-grid"]}>
                {/* Visual panel — sticky so it stays visible alongside the long spec table */}
                <div className={styles["detail-visual-sticky"]}>
                  <div className={styles["detail-visual"]}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <i className={`fas ${icon}`} />
                    )}
                  </div>
                </div>

                {/* Info panel */}
                <div>
                  <div className={styles["detail-eyebrow"]}>
                    <span className={styles["eyebrow-text"]}>Product detail</span>
                  </div>

                  <h1 className={styles["detail-name"]}>{product.name}</h1>

                  {product.modelCode && (
                    <span className={styles["detail-model"]}>
                      {product.modelCode}
                    </span>
                  )}

                  <div className={styles["detail-divider"]} />

                  <p className={styles["detail-short-desc"]}>
                    {product.shortDesc ?? ""}
                  </p>

                  <SpecTable longDesc={product.longDesc ?? ""} />

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <i className="fab fa-whatsapp" />
                    Get a Quote for this Product
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <GlobalFooter />
      </div>
      <PageReadySignal />
    </>
  );
}
