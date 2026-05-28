import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://apbenterprise.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/products",
    "/contact",
    "/brochures",
    "/feedback",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      select: { modelCode: true, id: true, createdAt: true },
    });

    productRoutes = products.map((product) => {
      const slug = product.modelCode || String(product.id);
      return {
        url: `${SITE_URL}/products/${encodeURIComponent(slug)}`,
        lastModified: product.createdAt || new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
  }

  return [...staticRoutes, ...productRoutes];
}
