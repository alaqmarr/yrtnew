import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { galleryService } from "@/modules/gallery/service/gallery.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const items = await galleryService.getGallery(category);
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const created = await galleryService.addItem(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to add gallery item" },
      { status: 500 }
    );
  }
}
