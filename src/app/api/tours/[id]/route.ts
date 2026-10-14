import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { tourService } from "@/modules/tours/service/tour.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const tour = await tourService.getTourById(id);
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }
    return NextResponse.json(tour);
  } catch (error) {
    console.error("GET /api/tours/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch tour" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const updated = await tourService.updateTour({ ...body, id });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/tours/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update tour" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const success = await tourService.deleteTour(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/tours/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 });
  }
}
