import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Logger } from "@/lib/logger";

// Force Node.js runtime because @/lib/db uses pg Pool (native sockets/tls)
export const runtime = "nodejs";

/**
 * POST endpoint to receive and record verified client reviews.
 * Validates the reviewer's metadata, company details, rating scale, and message.
 * Persists the validated entry into PostgreSQL defaulted to `isFeatured: false` 
 * to ensure that all reviews undergo manual administrative curation before homepage displays.
 * 
 * @param {NextRequest} req - The incoming HTTP request with reviewer parameters.
 * @returns {Promise<NextResponse>} JSON response containing success state and review ID.
 */
export async function POST(req: NextRequest) {
  const startTime = performance.now();
  const requestId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const context = `api/review:REQ-${requestId}`;

  Logger.info(context, "Incoming Client Review Submission started.");

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
      Logger.warn(context, "Validation failed: Missing name.");
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!companyName.trim()) {
      Logger.warn(context, "Validation failed: Missing company name.");
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }
    if (!position.trim()) {
      Logger.warn(context, "Validation failed: Missing position.");
      return NextResponse.json({ error: "Position/Job Title is required." }, { status: 400 });
    }
    if (!location.trim()) {
      Logger.warn(context, "Validation failed: Missing location.");
      return NextResponse.json({ error: "City of service location is required." }, { status: 400 });
    }
    if (!message.trim()) {
      Logger.warn(context, "Validation failed: Message field was empty.");
      return NextResponse.json({ error: "Review message is required." }, { status: 400 });
    }

    const rating = parseInt(ratingRaw ?? "0", 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      Logger.warn(context, `Validation failed: Invalid rating score (${ratingRaw}).`);
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
    Logger.perf(context, "Review record saved to Neon DB", performance.now() - dbStart);

    Logger.success(context, `Client review from "${name.trim()}" (${companyName.trim()}) persisted successfully in ${(performance.now() - startTime).toFixed(1)}ms. Pending manual curation.`);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully.",
      reviewId: newReview.id,
    });
  } catch (err) {
    Logger.error(context, "Internal Server Error during review submission", err);
    return NextResponse.json(
      { error: "Internal server error while saving the review." },
      { status: 500 }
    );
  }
}
