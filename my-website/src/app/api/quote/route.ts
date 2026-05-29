import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Logger } from "@/lib/logger";

// Force Node.js runtime — required because @/lib/db uses the pg Pool
// which relies on Node.js net/tls APIs unavailable in the Edge runtime.
export const runtime = "nodejs";

/**
 * POST endpoint to process and record B2B Quote Requests.
 * Generates a unique request trace ID, validates inputs, persists the lead inside
 * the PostgreSQL database, and compiles a formatted WhatsApp redirection URL using
 * dynamically queried business contact details.
 * 
 * @param {NextRequest} req - The incoming HTTP request containing client parameters.
 * @returns {Promise<NextResponse>} JSON response containing success state and redirect URL.
 */
export async function POST(req: NextRequest) {
  const startTime = performance.now();
  const requestId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const context = `api/quote:REQ-${requestId}`;

  Logger.info(context, "Incoming Quote Request started.");

  try {
    const body = await req.json();
    const name: string = body.name ?? "";
    const mobileNumber: string = body.mobileNumber ?? "";
    const message: string = body.message ?? "";

    if (!name.trim() || !mobileNumber.trim()) {
      Logger.warn(context, "Validation failed: Missing required fields (name/mobileNumber).");
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
    Logger.perf(context, "QuoteRequest saved to Neon DB", performance.now() - dbStart);

    // Read WhatsApp number dynamically from contacts table
    const contactStart = performance.now();
    const contact = await prisma.contact.findFirst({
      select: { whatsappPrimary: true },
    });
    Logger.perf(context, "Fetch contact configuration completed", performance.now() - contactStart);

    let whatsappUrl: string | null = null;
    if (contact?.whatsappPrimary) {
      const number = contact.whatsappPrimary.replace(/\D/g, "");
      const text = encodeURIComponent(
        `Hi, I'm ${name.trim()} (${mobileNumber.trim()}).\n${message.trim() || "I'd like to know more about your products."}`
      );
      whatsappUrl = `https://wa.me/${number}?text=${text}`;
    } else {
      Logger.warn(context, "whatsappPrimary contact number was empty in the database. Using fallback.");
    }

    Logger.success(context, `Quote Request processed successfully in ${(performance.now() - startTime).toFixed(1)}ms`);

    return NextResponse.json({ success: true, whatsappUrl });
  } catch (err) {
    Logger.error(context, "Internal Server Error during quote processing", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}