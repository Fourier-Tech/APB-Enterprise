import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Force Node.js runtime — required because @/lib/db uses the pg Pool
// which relies on Node.js net/tls APIs unavailable in the Edge runtime.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name: string = body.name ?? "";
    const mobileNumber: string = body.mobileNumber ?? "";
    const message: string = body.message ?? "";

    if (!name.trim() || !mobileNumber.trim()) {
      return NextResponse.json(
        { error: "Name and mobile number are required." },
        { status: 400 }
      );
    }

    // Save to DB
    await prisma.quoteRequest.create({
      data: {
        formType: "quote",
        name: name.trim(),
        mobile_number: mobileNumber.trim(),
        msg: message.trim() || null,
      },
    });

    // Read WhatsApp number dynamically from contacts table
    const contact = await prisma.contact.findFirst({
      select: { whatsappPrimary: true },
    });

    let whatsappUrl: string | null = null;
    if (contact?.whatsappPrimary) {
      const number = contact.whatsappPrimary.replace(/\D/g, "");
      const text = encodeURIComponent(
        `Hi, I'm ${name.trim()} (${mobileNumber.trim()}).\n${message.trim() || "I'd like to know more about your products."}`
      );
      whatsappUrl = `https://wa.me/${number}?text=${text}`;
    }

    return NextResponse.json({ success: true, whatsappUrl });
  } catch (err) {
    console.error("[api/quote] error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}