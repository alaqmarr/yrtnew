import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { destinationService } from "@/modules/destinations/service/destination.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const destination = await destinationService.getDestinationById(id);
    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }
    return NextResponse.json(destination);
  } catch (error) {
    console.error("GET /api/destinations/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch destination" }, { status: 500 });
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
    const updated = await destinationService.updateDestination({ ...body, id });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/destinations/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update destination" },
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
    const success = await destinationService.deleteDestination(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/destinations/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete destination" }, { status: 500 });
  }
}
