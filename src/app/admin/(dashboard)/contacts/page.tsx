import { contactService } from "@/modules/contacts/service/contact.service";
import AdminContactsManager from "@/modules/contacts/components/AdminContactsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customer Base & CRM (Client Intelligence) | Yellow Ribbon Admin",
};

export default async function AdminContactsPage() {
  const { contacts, total } = await contactService.getContacts({
    limit: 100,
    sortBy: "spent",
  });

  return (
    <AdminContactsManager
      initialContacts={contacts}
      initialTotal={total}
    />
  );
}
