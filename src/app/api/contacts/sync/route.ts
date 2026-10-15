import { NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { contactService } from "@/modules/contacts/service/contact.service";

export async function POST() {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const result = await contactService.syncAllHistoricalContacts();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("POST /api/contacts/sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync historical contacts" },
      { status: 500 }
    );
  }
}
