import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding with original data...");

  // 1. Clean existing records
  await prisma.product.deleteMany();
  await prisma.brochure.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.quoteRequest.deleteMany();

  // 2. Seed global contact details (single row)
  const contactData = {
    "facebookUrl": "https://facebook.com/apbenterprise",
    "instagramUrl": null,
    "linkedinUrl": null,
    "twitterUrl": null,
    "youtubeUrl": null,
    "whatsappUrl": "https://wa.me/918460348566",
    "phonePrimary": "+91 96243 44496",
    "phoneSecondary": null,
    "whatsappPrimary": "+91 84603 48566",
    "whatsappSecondary": "+91 94082 61204",
    "emailPrimary": "apbenterprise1@gmail.com",
    "emailSecondary": null,
    "address": "Dhanlaxmi estate, 26, bhuvaladi road, nr. Ved estate, gidc, Kathwada, Ahmedabad, Gujarat 382430",
    "addressUrl": "https://maps.app.goo.gl/nK3NYoRxsUwkagRk6",
    "updatedAt": "2026-05-29T10:19:42.898Z"
};
  
  if (Object.keys(contactData).length > 0) {
    const contact = await prisma.contact.create({
      data: contactData,
    });
    console.log(`✅ Seeded global contact parameters: ID ${contact.id}`);
  }

  // 3. Seed products
  const productsData = [
    {
        "name": "LCD Card Panel",
        "modelCode": "APB - 100",
        "shortDesc": "Reliable lift controller with 3.7–15KW drive support, 8-stop operation, auto/manual door control, and 4-Pole MCB power incomer protection.",
        "longDesc": "Drive KW=3.7 KW, 5.5KW, 7.5KW, 11 KW, 15 KW.|Number of Stops=8 Stops Down Collective, 6 Stops Full Collective.|Reed Type=Three Reed / Floor Reed.|Speed=Up to 1 mps.|Controller Type=Auto Door / Manual Door.|Display Output=7 Segment.|Motor Suitable=Geared AC Induction Motor|Overall Cabinet Size=670 x 750 x 250|DBR=Separately housed in a DBR box mounted on top of Cabinet|Cabinet Locks=2Nos Chrome Plated Aesthetic Locks|Cover Plate=Cover Plate provided for Legs for Aesthetic Looks|ARD Interface=Provided as Constant;(Contactors SC and UPC provided)|Power supply for 12V/24V DC=SMPS type, mounted on DIN rall / Panel Mounted;Input : 110-230V AC, output : 12V / 24V DC, 5Amps|Safely Interface=110V AC safely Chain|Field terminations for Power Terminals=Screw terminals (Connectwell / Elmax make) provided of 4.0 sq mm wire capacity|Field terminations for Control Terminals=Screw terminals (Connectwell/ ELmax make) provided of 2.5 sq mm wire capacity|Transformer=Primary : 230V, AC, IPhase|MCB Protection=MCB1 - 4Pole for 415-230V Power Incomer.;MCB2 - 1Pole for 110V Safety Chain and Contractors;MCB3 - 1Pole for Panel Light.|Fuse protection=Glass Fuse, 4Amps for 12/24V DC Control|Three Phase Power Failure Relay=APB / Gic / Selec|Controller Inspection=Panel with U, D button and Selector switch|Landing door Jumper Protection=Protection provided through connectors.|Line (Input) Choke=Provided as a Requirement.|DBR Rating=As Per Panel Requirement.",
        "category": "geared controller",
        "imageUrl": null,
        "isFeatured": false,
        "displayOrder": 1
    },
    {
        "name": "LCD Card Panel With Monarch Drive",
        "modelCode": "APB = 101",
        "shortDesc": "Reliable lift controller with 3.7–15KW drive support, 8-stop operation, auto/manual door control, and 3-Pole MCB power incomer protection.",
        "longDesc": "Drive KW=3.7 KW, 5.5KW, 7.5KW, 11 KW, 15 KW.|Number of Stops=8 Stops Down Collective, 6 Stops Full Collective.|Reed Type=Three Reed / Floor Reed.|Speed=Up to 1 mps.|Controller Type=Auto Door / Manual Door.|Display Output=7 Segment.|Motor Suitable=Geared AC Induction Motor|Overall Cabinet Size=670 x 750 x 250|DBR=Separately housed in a DBR box mounted on top of Cabinet|Cabinet Locks=2Nos Chrome Plated Aesthetic Locks|Cover Plate=Cover Plate provided for Legs for Aesthetic Looks|ARD Interface=Provided as Constant;(Contactors SC and UPC provided)|Power supply for 12V/24V DC=SMPS type, mounted on DIN rall / Panel Mounted;Input : 110-230V AC, output : 12V / 24V DC, 5Amps|Safely Interface=110V AC safely Chain|Field terminations for Power Terminals=Screw terminals (Connectwell / Elmax make) provided of 4.0 sq mm wire capacity|Field terminations for Control Terminals=Screw terminals (Connectwell/ ELmax make) provided of 2.5 sq mm wire capacity|Transformer=Primary : 230V, AC, IPhase|MCB Protection=MCB1 - 3Pole for 415-230V Power Incomer.;MCB2 - 1Pole for 110V Safety Chain and Contractors;MCB3 - 1Pole for Panel Light.|Fuse protection=Glass Fuse, 4Amps for 12/24V DC Control|Three Phase Power Failure Relay=APB / Gic / Selec|Controller Inspection=Panel with U, D button and Selector switch|Landing door Jumper Protection=Protection provided through connectors.|Line (Input) Choke=Provided as a Requirement.|DBR Rating=As Per Panel Requirement.",
        "category": "geared controller",
        "imageUrl": null,
        "isFeatured": false,
        "displayOrder": 2
    },
    {
        "name": "LCD Card Panel With INVT Drive",
        "modelCode": "APB - 102",
        "shortDesc": "Reliable lift controller with 3.7–15KW drive support, 8-stop operation, auto/manual door control, and 4-Pole MCB power incomer protection.",
        "longDesc": "Drive KW=3.7 KW, 5.5KW, 7.5KW, 11 KW, 15 KW.|Number of Stops=8 Stops Down Collective, 6 Stops Full Collective.|Reed Type=Three Reed / Floor Reed.|Speed=Up to 1 mps.|Controller Type=Auto Door / Manual Door.|Display Output=7 Segment.|Motor Suitable=Geared AC Induction Motor|Overall Cabinet Size=670 x 750 x 250|DBR=Separately housed in a DBR box mounted on top of Cabinet|Cabinet Locks=2Nos Chrome Plated Aesthetic Locks|Cover Plate=Cover Plate provided for Legs for Aesthetic Looks|ARD Interface=Provided as Constant;(Contactors SC and UPC provided)|Power supply for 12V/24V DC=SMPS type, mounted on DIN rall / Panel Mounted;Input : 110-230V AC, output : 12V / 24V DC, 5Amps|Safely Interface=110V AC safely Chain|Field terminations for Power Terminals=Screw terminals (Connectwell / Elmax make) provided of 4.0 sq mm wire capacity|Field terminations for Control Terminals=Screw terminals (Connectwell/ ELmax make) provided of 2.5 sq mm wire capacity|Transformer=Primary : 230V, AC, IPhase|MCB Protection=MCB1 - 4Pole for 415-230V Power Incomer.;MCB2 - 1Pole for 110V Safety Chain and Contractors;MCB3 - 1Pole for Panel Light.|Fuse protection=Glass Fuse, 4Amps for 12/24V DC Control|Three Phase Power Failure Relay=APB / Gic / Selec|Controller Inspection=Panel with U, D button and Selector switch|Landing door Jumper Protection=Protection provided through connectors.|Line (Input) Choke=Provided as a Requirement.|DBR Rating=As Per Panel Requirement.",
        "category": "gearless controller",
        "imageUrl": null,
        "isFeatured": false,
        "displayOrder": 3
    },
    {
        "name": "Close Loop Integrated Controller",
        "modelCode": "APB - 200",
        "shortDesc": "High-capacity lift controller with 3.7–20KW drive support, 16-stop full collective operation, 1.5 m/s speed, semi-auto door control, gearless motor support, and advanced 4-pole MCB + RCCB protection.",
        "longDesc": "Drive KW=3.7 KW, 5.5KW, 7.5KW, 11KW, 15KW, 18KW, 20KW.|Number of Stops=16 Stops Full Collective.|Speed=Up to 1.5 mps.|Controller Type=Auto Door / Manual Door / Semi Auto Door.|Display Output=7 Segment, Binary, Gray.|Motor Suitable=Geared AC Motor/ Gearless Ac Motor.|Overall Cabinet Size=1480 x 320 x 250 / 670 x 750 x 250|DBR=Separately housed in a DBR box.|Cabinet Locks=2Nos Chrome Plated Aesthetic Locks.|ARD Interface=Provided as Constant;(Contactors SC and UPC provided)|Power supply for 24V DC=SMPS type, mounted on DIN rall;Input : 110-230V AC, output : 24V DC, 2.5/5Amps|Safely Interface=110V AC safely Chain|Field terminations for Power Terminals=Screw terminals (Connectwell / Elmax make) provided of 4.0 sq mm wire capacity|Field terminations for Control Terminals=Screw terminals (Connectwell/ ELmax make) provided of 2.5 sq mm wire capacity|Transformer=Primary : 600VA, 440V, AC, 2Phase|MCB Protection=MCB1 - 4Pole for 415-230V Power Incomer.;MCB2 - 2Pole for UPS Power Incomer.;MCB3 - 1Pole for 110V Safety Chain & Contactor.;MCB4 - 1Pole For Panel Light|RCCB Protection=25Amp - 30mA - 2 Pole|Three Phase Power Failure Relay=Gic / Selec / cemic|Controller Inspection=Panel with U, D button and Selector switch|Landing door Jumper Protection=Protection provided through connectors.|Line (Input) Choke=Provided as a Constant.|DBR Rating=As Per Panel Requirement.",
        "category": "monarch integrated controller",
        "imageUrl": null,
        "isFeatured": false,
        "displayOrder": 4
    },
    {
        "name": "Open Loop Integrated Controller",
        "modelCode": "APB - 300",
        "shortDesc": "High-capacity lift controller with 3.7–20KW drive support, 16-stop full collective, 1.5 m/s speed, geared AC motor, semi-auto door control, and 4-pole MCB + RCCB protection.",
        "longDesc": "Drive KW=3.7 KW, 5.5KW, 7.5KW, 11KW, 15KW, 18KW, 20KW.|Number of Stops=16 Stops Full Collective.|Speed=Up to 1.5 mps.|Controller Type=Auto Door / Manual Door / Semi Auto Door.|Display Output=7 Segment, Binary, Gray.|Motor Suitable=Geared AC Motor|Overall Cabinet Size=1480 x 320 x 250 / 670 x 750 X 250|DBR=Separately housed in a DBR box.|Cabinet Locks=2Nos Chrome Plated Aesthetic Locks.|ARD Interface=Provided as Constant;(Contactors SC and UPC provided)|Power supply for 24V DC=SMPS type, mounted on DIN rall;Input : 110-230V AC, output : 24V DC, 2.5/5Amps|Safely Interface=110V AC safely Chain|Field terminations for Power Terminals=Screw terminals (Connectwell / Elmax make) provided of 4.0 sq mm wire capacity|Field terminations for Control Terminals=Screw terminals (Connectwell/ ELmax make) provided of 2.5 sq mm wire capacity|Transformer=Primary : 600VA, 440V, AC, 2Phase|MCB Protection=MCB1 - 4Pole for 415-230V Power Incomer.;MCB2 - 2Pole for UPS Power Incomer.;MCB3 - 1Pole for 110V Safety Chain & Contactor.;MCB4 - 1Pole For Panel Light|RCCB Protection=25Amp - 30mA - 2 Pole|Three Phase Power Failure Relay=Gic / Selec / cemic|Controller Inspection=Panel with U, D button and Selector switch|Landing door Jumper Protection=Protection provided through connectors.|Line (Input) Choke=Provided as a Constant.|DBR Rating=As Per Panel Requirement.",
        "category": "monarch integrated controller",
        "imageUrl": null,
        "isFeatured": false,
        "displayOrder": 5
    },
    {
        "name": "Parallel Integrated Controller",
        "modelCode": "APB - 400",
        "shortDesc": "Premium lift controller with 3.7–20KW drive, 40-stop full collective, 2 m/s speed, gearless motor support, serial output display, and heavy-duty 600/1000VA transformer with MCB + RCCB protection.",
        "longDesc": "Drive KW=3.7 KW, 5.5KW, 7.5KW, 11KW, 15KW, 18KW, 20KW.|Number of Stops=40 Stops Full Collective.|Speed=Up to 2 mps.|Controller Type=Auto Door.|Display Output=Serial Output|Motor Suitable=Geared AC Motor/ Gearless Ac Motor.|Overall Cabinet Size=1480 x 320 x 250 / 670 x 750 X 250|DBR=Separately housed in a DBR box.|Cabinet Locks=2Nos Chrome Plated Aesthetic Locks.|ARD Interface=Provided as Constant;(Contactors SC and UPC provided)|Power supply for 24V DC=SMPS type, mounted on DIN rall;Input : 110-230V AC, output : 24V DC, 5/10Amps|Safely Interface=110V AC safely Chain|Field terminations for Power Terminals=Screw terminals (Connectwell / Elmax make) provided of 4.0 sq mm wire capacity|Field terminations for Control Terminals=Screw terminals (Connectwell/ ELmax make) provided of 2.5 sq mm wire capacity|Transformer=Primary : 600/1000 VA, 440V, AC, 2Phase|MCB Protection=MCB1 - 4Pole for 415-230V Power Incomer.;MCB2 - 2Pole for UPS Power Incomer.;MCB3 - 1Pole for 110V Safety Chain & Contactor.;MCB4 - 1Pole For Panel Light|RCCB Protection=25Amp - 30mA - 2 Pole|Three Phase Power Failure Relay=Gic / Selec / cemic|Controller Inspection=Panel with U, D button and Selector switch|Landing door Jumper Protection=Protection provided through connectors.|Line (Input) Choke=Provided as a Constant.|DBR Rating=As Per Panel Requirement.",
        "category": "monarch integrated controller",
        "imageUrl": null,
        "isFeatured": false,
        "displayOrder": 6
    },
    {
        "name": "All Types of Hydraulic Suitables",
        "modelCode": "APB - 500",
        "shortDesc": "Single-phase lift controller with 3.7–15KW power pack, 8-stop operation, UPS interface, 12V/24V SMPS power supply, and 4-pole MCB with fuse protection.",
        "longDesc": "Power Pack KW=3.7 KW, 5.5KW, 7.5KW, 11 KW, 15 KW.|Number of Stops=8 Stops Down Collective, 6 Stops Full Collective.|Reed Type=Three Reed / Floor Reed.|Controller Type=Auto Door / Manual Door.|Display Output=7 Segment.|Overall Cabinet Size=670 x 750 x 250|Cabinet Locks=2Nos Chrome Plated Aesthetic Locks|Cover Plate=Cover Plate provided for Legs for Aesthetic Looks|UPS Interface=Provided as Constant.|Power supply for 12V/24V DC=SMPS type, mounted on DIN rall / Panel Mounted;Input : 110-230V AC, output : 12V / 24V DC, 5Amps|Safely Interface=110V AC safely Chain|Field terminations for Power Terminals=Screw terminals (Connectwell / Elmax make) provided of 4.0 sq mm wire capacity|Field terminations for Control Terminals=Screw terminals (Connectwell/ ELmax make) provided of 2.5 sq mm wire capacity|Transformer=Primary : 230V, AC, IPhase|MCB Protection=MCB1 - 4Pole for 415-230V Power Incomer.;MCB2 - 1Pole for Single Phase Supply;MCB3 - 1Pole for Panel Light.|Fuse protection=Glass Fuse, 4Amps for 12/24V DC Control|Three Phase Power Failure Relay=APB / Gic / Selec|Controller Inspection=Panel with U, D button and Selector switch|Landing door Jumper Protection=Protection provided through connectors.",
        "category": "hydraulic controller",
        "imageUrl": null,
        "isFeatured": false,
        "displayOrder": 7
    },
    {
        "name": "All Types of Goods Panel",
        "modelCode": "APB - 501",
        "shortDesc": "Compact manual door lift controller with 3.7–15KW motor, 4-stop down collective, smaller 550x480x200 cabinet, 12V DC output, and essential MCB & fuse protection.",
        "longDesc": "Motar KW=3.7 KW, 5.5KW, 7.5KW, 11 KW, 15 KW.|Number of Stops=4 Stops Down Collective.|Reed Type=Three Reed / Floor Reed.|Controller Type=Manual Door.|Display Output=7 Segment.|Overall Cabinet Size=550 x 480 x 200|Cabinet Locks=2Nos Chrome Plated Aesthetic Locks|Power supply for 12V/24V DC=SMPS type, mounted on DIN rall / Panel Mounted;Input : 230V AC, output : 12V DC, 5Amps|Field terminations for Power Terminals=Screw terminals (Connectwell / Elmax make) provided of 4.0 sq mm wire capacity|Field terminations for Control Terminals=Screw terminals (Connectwell/ ELmax make) provided of 2.5 sq mm wire capacity|Transformer=Primary : 230V, AC, IPhase|MCB Protection=MCB1 - 4Pole for 415-230V Power Incomer.;MCB2 - 1Pole for Panel Light.|Fuse protection=Glass Fuse, 4Amps for 12/24V DC Control|Three Phase Power Failure Relay=APB / Gic / Selec|Controller Inspection=Panel with U, D button and Selector switch|Landing door Jumper Protection=Protection provided through connectors.",
        "category": "goods lift controller",
        "imageUrl": null,
        "isFeatured": false,
        "displayOrder": 8
    }
];

  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: productData,
    });
    console.log(`✅ Seeded product: ${product.name} (${product.modelCode})`);
  }

  // 4. Seed active brochures
  const brochuresData = [
    {
        "title": "APB Enterprise - Catalogue 2026",
        "fileUrl": "https://odmxozftqwzjxtnpstsi.supabase.co/storage/v1/object/public/pdfs/apb_brochure.pdf",
        "displayOrder": 1,
        "isActive": true
    }
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
