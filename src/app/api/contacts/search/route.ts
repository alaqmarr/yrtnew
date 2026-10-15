import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { contactService } from "@/modules/contacts/service/contact.service";

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "8", 10);

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results = await contactService.searchContacts(query, limit);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("GET /api/contacts/search error:", error);
    return NextResponse.json(
      { error: "Failed to search contacts" },
      { status: 500 }
    );
  }
}
