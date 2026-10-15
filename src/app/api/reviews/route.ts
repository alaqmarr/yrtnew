import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { reviewService } from "@/modules/reviews/service/review.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;

    if (all) {
      const { errorResponse } = await requireStaffOrAdmin();
      if (errorResponse) return errorResponse;
      const reviews = await reviewService.getAllReviews();
      return NextResponse.json(reviews);
    }

    const reviews = await reviewService.getPublishedReviews(minRating);
    const stats = await reviewService.getReviewStats();
    return NextResponse.json({ reviews, stats });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if it's a sync request from admin
    if (body.action === "sync-google") {
      const { errorResponse } = await requireStaffOrAdmin();
      if (errorResponse) return errorResponse;
      const result = await reviewService.syncGoogleReviews();
      return NextResponse.json(result);
    }

    const created = await reviewService.submitReview(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
