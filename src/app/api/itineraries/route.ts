import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { itineraryService } from "@/modules/itineraries/service/itinerary.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itineraries = await itineraryService.getAllItineraries();
    return NextResponse.json(itineraries);
  } catch (error) {
    console.error("GET /api/itineraries error:", error);
    return NextResponse.json({ error: "Failed to fetch itineraries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await itineraryService.createItinerary(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/itineraries error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create itinerary" },
      { status: 500 }
    );
  }
}
