import { prisma } from "@/lib/db";
import Footer from "./Footer";

export default async function GlobalFooter({
  hideQuoteStrip = false,
}: {
  hideQuoteStrip?: boolean;
}) {
  let contact = null;
  let categories: string[] = [];

  try {
    const [rawContact, products] = await Promise.all([
      prisma.contact.findFirst(),
      prisma.product.findMany({ select: { category: true } }),
    ]);

    contact = rawContact;

    // Extract unique categories, sort alphabetically, and take the first 4
    categories = Array.from(new Set(products.map((p) => p.category)))
      .filter(Boolean)
      .sort()
      .slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch footer data:", error);
  }

  return (
    <Footer
      contact={contact}
      categories={categories}
      hideQuoteStrip={hideQuoteStrip}
    />
  );
}
