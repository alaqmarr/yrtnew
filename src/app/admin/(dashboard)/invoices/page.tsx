import { invoiceService } from "@/modules/invoices/service/invoice.service";
import AdminInvoicesManager from "@/modules/invoices/components/AdminInvoicesManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Invoices & Custom Quotes | Yellow Ribbon Admin",
};

export default async function AdminInvoicesPage() {
  const invoices = await invoiceService.getAllInvoices();

  return <AdminInvoicesManager initialInvoices={invoices} />;
}
