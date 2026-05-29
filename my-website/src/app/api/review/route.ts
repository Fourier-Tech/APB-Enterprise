import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Force Node.js runtime because @/lib/db uses pg Pool (native sockets/tls)
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const startTime = performance.now();
  const requestId = Math.random().toString(36).substring(2, 10).toUpperCase();

  console.log(`[INFO] [REQ-${requestId}] Incoming Client Review Submission started.`);

  try {
    const body = await req.json();
    const name: string = body.name ?? "";
    const companyName: string = body.companyName ?? "";
    const position: string = body.position ?? "";
    const location: string = body.location ?? "";
    const ratingRaw = body.rating;
    const message: string = body.message ?? "";

    // Input Validation
    if (!name.trim()) {
      console.warn(`[WARN] [REQ-${requestId}] Validation failed: Missing name.`);
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!companyName.trim()) {
      console.warn(`[WARN] [REQ-${requestId}] Validation failed: Missing company name.`);
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }
    if (!position.trim()) {
      console.warn(`[WARN] [REQ-${requestId}] Validation failed: Missing position.`);
      return NextResponse.json({ error: "Position/Job Title is required." }, { status: 400 });
    }
    if (!location.trim()) {
      console.warn(`[WARN] [REQ-${requestId}] Validation failed: Missing location.`);
      return NextResponse.json({ error: "City of service location is required." }, { status: 400 });
    }
    if (!message.trim()) {
      console.warn(`[WARN] [REQ-${requestId}] Validation failed: Message field was empty.`);
      return NextResponse.json({ error: "Review message is required." }, { status: 400 });
    }

    const rating = parseInt(ratingRaw ?? "0", 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      console.warn(`[WARN] [REQ-${requestId}] Validation failed: Invalid rating score (${ratingRaw}).`);
      return NextResponse.json({ error: "Rating must be a number between 1 and 5." }, { status: 400 });
    }

    // Save the review record into PostgreSQL using Prisma Client
    const dbStart = performance.now();
    const newReview = await prisma.review.create({
      data: {
        name: name.trim(),
        companyName: companyName.trim(),
        position: position.trim(),
        location: location.trim(),
        rating,
        message: message.trim(),
        isFeatured: false, // For manual curation by site owners
      },
    });
    console.log(`[PERF] [REQ-${requestId}] Review record saved to Neon DB in ${(performance.now() - dbStart).toFixed(1)}ms`);

    const duration = performance.now() - startTime;
    console.log(`[SUCCESS] [REQ-${requestId}] Client review from "${name.trim()}" (${companyName.trim()}) persisted successfully in ${duration.toFixed(1)}ms. Pending manual curation.`);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully.",
      reviewId: newReview.id,
    });
  } catch (err) {
    const duration = performance.now() - startTime;
    console.error(`[ERROR] [REQ-${requestId}] Internal Server Error during review submission after ${duration.toFixed(1)}ms:`, err);
    return NextResponse.json(
      { error: "Internal server error while saving the review." },
      { status: 500 }
    );
  }
}
