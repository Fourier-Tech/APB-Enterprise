import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

// Setup adapter for Prisma 7 CLI seed execution
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing records (ensures clean slate on successive runs)
  await prisma.product.deleteMany();
  await prisma.brochure.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.quoteRequest.deleteMany();

  // 2. Seed global contact details (single row)
  const contact = await prisma.contact.create({
    data: {
      address: "45-62-63, Fortune Industrial Estate, Kathwada, Kathwada Singarwa Road, Kathwada, Ahmedabad, Gujarat - 382430",
      addressUrl: "https://maps.google.com/?q=Fortune+Industrial+Estate+Kathwada+Ahmedabad",
      phonePrimary: "+91 84603 48566",
      phoneSecondary: "+91 94082 61204",
      whatsappPrimary: "+91 84603 48566",
      whatsappSecondary: "+91 96243 44496",
      emailPrimary: "apbenterprise1@gmail.com",
      emailSecondary: "sales@apbenterprise.com",
      whatsappUrl: "https://wa.me/918460348566",
      facebookUrl: "https://facebook.com/apbenterprise",
      instagramUrl: "https://instagram.com/apbenterprise",
      linkedinUrl: "https://linkedin.com/company/apb-enterprise",
      twitterUrl: "https://twitter.com/apbenterprise",
      youtubeUrl: "https://youtube.com/c/apbenterprise",
    },
  });
  console.log(`✅ Seeded global contact parameters: ID ${contact.id}`);

  // 3. Seed 10 realistic products for APB Enterprise
  const productsData = [
    {
      name: "Integrated Elevator Controller",
      modelCode: "APB-101",
      category: "integrated",
      isFeatured: true,
      displayOrder: 1,
      shortDesc: "State-of-the-art integrated controller for synchronous and asynchronous traction elevators.",
      longDesc: "The APB-101 is our flagship integrated controller featuring dual 32-bit microprocessors for absolute precision and reliability. Designed to support both geared and gearless traction systems, it integrates VVVF drive control and logic control into a single unified block, reducing panel size and eliminating complex inter-wiring.",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1610000000/apb-101.jpg",
    },
    {
      name: "Parallel Control Panel",
      modelCode: "APB-200",
      category: "integrated",
      isFeatured: true,
      displayOrder: 2,
      shortDesc: "Robust parallel wiring controller for low to medium-rise hydraulic and traction passenger lifts.",
      longDesc: "Engineered for maximum durability, the APB-200 provides simple parallel wiring logic, making it exceptionally easy to install and service. Ideal for passenger elevators in low-rise residential and commercial buildings.",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1610000000/apb-200.jpg",
    },
    {
      name: "Integrated Serial COP/LOP Panel",
      modelCode: "APB-301",
      category: "nice_series",
      isFeatured: true,
      displayOrder: 3,
      shortDesc: "Intelligent serial communications car operating panel with premium tactile push buttons.",
      longDesc: "The APB-301 represents the peak of in-car elevator UI. Offering high-speed serial communications, this panel reduces wiring down to 4 wires, minimizing data loss risks. Features premium backlit push buttons, custom dot-matrix/TFT display interfaces, and direct floor lock controls.",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1610000000/apb-301.jpg",
    },
    {
      name: "Geared Controller Block",
      modelCode: "APB-500",
      category: "geared",
      isFeatured: true,
      displayOrder: 4,
      shortDesc: "Precision geared control unit with built-in emergency backup rescue systems.",
      longDesc: "Optimized for geared traction systems, the APB-500 offers smooth VVVF speed curves and precise floor leveling. Equipped with a built-in Automatic Rescue Device (ARD) and phase failure protection for absolute passenger safety.",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1610000000/apb-500.jpg",
    },
    {
      name: "Integrated Gearless Drive Controller",
      modelCode: "APB-102",
      category: "gearless",
      isFeatured: false,
      displayOrder: 5,
      shortDesc: "Energy-efficient VVVF closed-loop gearless controller with regenerative braking support.",
      longDesc: "Specially optimized for permanent magnet synchronous (PMS) gearless motors. The APB-102 utilizes closed-loop vector control to achieve unmatched riding smoothness, high floor-level accuracy, and up to 40% energy savings compared to standard geared systems.",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1610000000/apb-102.jpg",
    },
    {
      name: "Hydraulic Control Unit",
      modelCode: "APB-103",
      category: "hydraulic",
      isFeatured: false,
      displayOrder: 6,
      shortDesc: "Compact controller designed for smooth, high-capacity hydraulic passenger and cargo elevators.",
      longDesc: "Designed with custom valve-control algorithms, the APB-103 provides excellent levelling accuracy and acceleration control for hydraulic elevators. Fully compliant with industrial lifting safety regulations.",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1610000000/apb-103.jpg",
    },
    {
      name: "Goods Lift Controller",
      modelCode: "APB-501",
      category: "goods",
      isFeatured: false,
      displayOrder: 7,
      shortDesc: "Heavy-duty industrial goods lift controller with multi-door interlocking logic.",
      longDesc: "The APB-501 is built for industrial-strength environments. Features heavy-duty enclosures, multi-door landing controls, mechanical gate safety loops, and customizable auto-parking/fire recall setups.",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1610000000/apb-501.jpg",
    },
    {
      name: "NICE 1000+ Integrated Block",
      modelCode: "NICE-1000+",
      category: "nice_series",
      isFeatured: false,
      displayOrder: 8,
      shortDesc: "Compact integrated controller block with advanced distance-control algorithms.",
      longDesc: "Integrating advanced vector motor drive technology and intelligent control software, the NICE-1000+ represents a highly reliable, compact, and cost-effective integrated block for modern vertical transportation.",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1610000000/nice-1000.jpg",
    },
    {
      name: "NICE 3000+ Controller",
      modelCode: "NICE-3000+",
      category: "nice_series",
      isFeatured: false,
      displayOrder: 9,
      shortDesc: "High-performance controller with support for up to 64 floors and group control up to 8 elevators.",
      longDesc: "The ultimate solution for high-rise, high-speed elevator arrays. The NICE-3000+ supports group dispatching of up to 8 lifts in parallel, utilizes CAN-Bus serial communications for high noise-immunity, and supports speeds up to 4.0 m/s.",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1610000000/nice-3000.jpg",
    },
    {
      name: "Plug-and-Play Wire Harness System",
      modelCode: "APB-WH-01",
      category: "integrated",
      isFeatured: false,
      displayOrder: 10,
      shortDesc: "Pre-tested, error-free plug and play wiring harnesses customized for all major lift configurations.",
      longDesc: "Eliminate layout wiring mistakes on-site. APB Enterprise designs, tests, and pre-assembles premium wire harnesses tailored specifically to your control panel, elevator shaft height, and landing buttons, drastically reducing installation time and costs.",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/v1610000000/apb-wh-01.jpg",
    },
  ];

  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: productData,
    });
    console.log(`✅ Seeded product: ${product.name} (${product.modelCode})`);
  }

  // 4. Seed active brochures matching Neon production database
  const brochuresData = [
    {
      title: "APB Enterprise - Catalogue 2026",
      fileUrl: "https://odmxozftqwzjxtnpstsi.supabase.co/storage/v1/object/public/pdfs/apd_brochure.pdf",
      displayOrder: 1,
      isActive: true,
    },
  ];

  for (const brochureData of brochuresData) {
    const brochure = await prisma.brochure.create({
      data: brochureData,
    });
    console.log(`✅ Seeded brochure: ${brochure.title}`);
  }

  console.log("🌱 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
