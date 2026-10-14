import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { itineraryService } from "@/modules/itineraries/service/itinerary.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const itinerary = await itineraryService.getItineraryById(id);
    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("GET /api/itineraries/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch itinerary" }, { status: 500 });
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
    const updated = await itineraryService.updateItinerary({ ...body, id });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/itineraries/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update itinerary" },
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
    const success = await itineraryService.deleteItinerary(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/itineraries/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete itinerary" }, { status: 500 });
  }
}
