import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { contactService } from "@/modules/contacts/service/contact.service";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
