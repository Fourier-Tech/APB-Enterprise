import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Force Node.js runtime — required because @/lib/db uses the pg Pool
// which relies on Node.js net/tls APIs unavailable in the Edge runtime.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const startTime = performance.now();
  const requestId = Math.random().toString(36).substring(2, 10).toUpperCase();

  console.log(`[INFO] [REQ-${requestId}] Incoming Quote Request started.`);

  try {
    const body = await req.json();
    const name: string = body.name ?? "";
    const mobileNumber: string = body.mobileNumber ?? "";
    const message: string = body.message ?? "";

    if (!name.trim() || !mobileNumber.trim()) {
      console.warn(`[WARN] [REQ-${requestId}] Validation failed: Missing required fields (name/mobileNumber).`);
      return NextResponse.json(
        { error: "Name and mobile number are required." },
        { status: 400 }
      );
    }

    // Save to DB
    const dbStart = performance.now();
    await prisma.quoteRequest.create({
      data: {
        formType: "quote",
        name: name.trim(),
        mobile_number: mobileNumber.trim(),
        msg: message.trim() || null,
      },
    });
    console.log(`[PERF] [REQ-${requestId}] QuoteRequest saved to Neon DB in ${(performance.now() - dbStart).toFixed(1)}ms`);

    // Read WhatsApp number dynamically from contacts table
    const contactStart = performance.now();
    const contact = await prisma.contact.findFirst({
      select: { whatsappPrimary: true },
    });
    console.log(`[PERF] [REQ-${requestId}] Fetch contact configuration completed in ${(performance.now() - contactStart).toFixed(1)}ms`);

    let whatsappUrl: string | null = null;
    if (contact?.whatsappPrimary) {
      const number = contact.whatsappPrimary.replace(/\D/g, "");
      const text = encodeURIComponent(
        `Hi, I'm ${name.trim()} (${mobileNumber.trim()}).\n${message.trim() || "I'd like to know more about your products."}`
      );
      whatsappUrl = `https://wa.me/${number}?text=${text}`;
    } else {
      console.warn(`[WARN] [REQ-${requestId}] whatsappPrimary contact number was empty in the database. Using fallback.`);
    }

    const duration = performance.now() - startTime;
    console.log(`[SUCCESS] [REQ-${requestId}] Quote Request processed successfully in ${duration.toFixed(1)}ms`);

    return NextResponse.json({ success: true, whatsappUrl });
  } catch (err) {
    const duration = performance.now() - startTime;
    console.error(`[ERROR] [REQ-${requestId}] Internal Server Error after ${duration.toFixed(1)}ms:`, err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}