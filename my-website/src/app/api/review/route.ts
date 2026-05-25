import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Force Node.js runtime because @/lib/db uses pg Pool (native sockets/tls)
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
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
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!companyName.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 });
    }
    if (!position.trim()) {
      return NextResponse.json({ error: "Position/Job Title is required." }, { status: 400 });
    }
    if (!location.trim()) {
      return NextResponse.json({ error: "City of service location is required." }, { status: 400 });
    }
    if (!message.trim()) {
      return NextResponse.json({ error: "Review message is required." }, { status: 400 });
    }

    const rating = parseInt(ratingRaw, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be a number between 1 and 5." }, { status: 400 });
    }

    // Save the review record into PostgreSQL using Prisma Client
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

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully.",
      reviewId: newReview.id,
    });
  } catch (err) {
    console.error("[api/review] POST error:", err);
    return NextResponse.json(
      { error: "Internal server error while saving the review." },
      { status: 500 }
    );
  }
}
