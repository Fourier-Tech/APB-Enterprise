"use client";

import { useState, useEffect, Suspense } from "react";
import type { Product } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "@/app/products/products.module.css";

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

function fmtCat(cat: string): string {
  return cat
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface Props {
  products: Product[];
}

function ProductsCatalogInner({ products }: Props) {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState<string>(categoryQuery || "All");

  useEffect(() => {
    if (categoryQuery) {
      setActiveCategory(categoryQuery);
      // Smoothly scroll to the catalog section when navigating via footer link
      setTimeout(() => {
        document.getElementById("catalog-tabs")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [categoryQuery]);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))).sort(),
  ];

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section className={styles["grid-section"]} id="catalog-tabs">
      <div className="container">
        {/* Section heading */}
        <div className={styles["grid-head"]} data-reveal>
          <div>
            <div className={styles["section-eyebrow"]}>Our products</div>
            <h2 className={styles["section-title"]}>
              Engineered for extreme reliability
            </h2>
          </div>
        </div>

        {/* Category tabs */}
        <div className={styles["category-tabs"]}>
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? products.length
                : products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat ?? ""}
                className={`${styles["cat-tab"]}${activeCategory === cat ? ` ${styles["active"]}` : ""}`}
                onClick={() => setActiveCategory(cat ?? "")}
              >
                {cat === "All" ? "All" : fmtCat(cat ?? "")}
                <span className={styles["cat-count"]}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        <div className={styles["products-grid"]}>
          {filtered.map((product) => {
            const icon = getCategoryIcon(product.category ?? "");
            const slug = product.modelCode ?? String(product.id);
            const shortDesc = product.shortDesc ?? "";
            return (
              <Link
                href={`/products/${encodeURIComponent(slug)}`}
                className={styles["product-card"]}
                key={product.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {/* Image / watermark */}
                <div className={styles["product-img-wrap"]}>
                  <span className={styles["product-badge"]}>APB Enterprise</span>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div className={styles["product-watermark"]}>
                      <i className={`fas ${icon}`} />
                      <span className={styles["product-watermark-label"]}>
                        {fmtCat(product.category ?? "")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className={styles["product-card-body"]}>
                  {product.modelCode && (
                    <div className={styles["model-code"]}>{product.modelCode}</div>
                  )}
                  <h3>{product.name}</h3>
                  <p className={styles["product-desc"]} title={shortDesc}>
                    {shortDesc}
                  </p>
                  <span className={styles["product-link"]}>
                    View Details <i className="fas fa-arrow-right fa-xs" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function ProductsCatalog({ products }: Props) {
  return (
    <Suspense fallback={<div style={{ minHeight: '600px' }} />}>
      <ProductsCatalogInner products={products} />
    </Suspense>
  );
}
