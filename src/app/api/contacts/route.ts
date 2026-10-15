import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { contactService } from "@/modules/contacts/service/contact.service";

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const tier = searchParams.get("tier") || "";
    const onlyRepeat = searchParams.get("onlyRepeat") === "true";
    const sortBy = (searchParams.get("sortBy") || "spent") as "spent" | "recent" | "deals" | "name";
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const { contacts, total } = await contactService.getContacts({
      search,
      tier,
      onlyRepeat,
      sortBy,
      limit,
      offset,
    });

    return NextResponse.json({ contacts, total });
  } catch (error) {
    console.error("GET /api/contacts error:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Customer name and phone number are required." },
        { status: 400 }
      );
    }

    const contact = await contactService.recordCustomerActivity({
      name,
      phone,
      email: body.email,
      city: body.city,
      source: body.source || "Manual Entry",
      notes: body.internal_notes,
    });

    if (body.preferences || body.tags || body.vip_status !== undefined || body.tier) {
      const updated = await contactService.updateContact(contact.id, {
        preferences: body.preferences,
        tags: body.tags,
        vip_status: body.vip_status,
        tier: body.tier,
        internal_notes: body.internal_notes,
      });
      return NextResponse.json(updated || contact, { status: 201 });
    }

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("POST /api/contacts error:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
