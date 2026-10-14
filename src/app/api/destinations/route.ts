import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { destinationService } from "@/modules/destinations/service/destination.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domesticOnly = searchParams.get("domestic") === "true";
    const internationalOnly = searchParams.get("international") === "true";
    const featuredOnly = searchParams.get("featured") === "true";

    const destinations = await destinationService.getAllDestinations({
      domesticOnly,
      internationalOnly,
      featuredOnly,
    });

    return NextResponse.json(destinations);
  } catch (error) {
    console.error("GET /api/destinations error:", error);
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const created = await destinationService.createDestination(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/destinations error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create destination" },
      { status: 500 }
    );
  }
}
