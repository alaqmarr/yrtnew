import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { contactService } from "@/modules/contacts/service/contact.service";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
