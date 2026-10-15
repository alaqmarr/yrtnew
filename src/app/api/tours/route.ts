import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { tourService } from "@/modules/tours/service/tour.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const destinationId = searchParams.get("destinationId") || undefined;
    const destinationSlug = searchParams.get("destinationSlug") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";
    const search = searchParams.get("search") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;

    const tours = await tourService.getAllTours({
      category,
      destinationId,
      destinationSlug,
      featuredOnly,
      search,
      minPrice,
      maxPrice,
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error("GET /api/tours error:", error);
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const created = await tourService.createTour(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/tours error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create tour" },
      { status: 500 }
    );
  }
}
