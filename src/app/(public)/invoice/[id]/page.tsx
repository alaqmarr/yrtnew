import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { invoiceService } from "@/modules/invoices/service/invoice.service";
import { InvoiceItem } from "@/modules/invoices/domain/invoice.entity";
import InvoiceActionButtons from "@/modules/invoices/components/InvoiceActionButtons";
import {
  FileText,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: RouteProps) {
  const { id } = await params;
  const invoice = await invoiceService.getInvoiceById(id);
  if (!invoice) return { title: "Document Not Found | Yellow Ribbon Travels" };
  return {
    title: `${invoice.type} ${invoice.invoice_number} - ${invoice.client_name} | Yellow Ribbon Travels`,
    description: `Official ${invoice.type} for ${invoice.client_name}. Total: ₹${invoice.total_amount.toLocaleString(
      "en-IN"
    )}.`,
  };
}

export default async function ClientInvoicePage({ params }: RouteProps) {
  const { id } = await params;
  const inv = await invoiceService.getInvoiceById(id);

  if (!inv) {
    notFound();
  }

  let items: InvoiceItem[] = [];
  try {
    items = JSON.parse(inv.items_json || "[]");
  } catch (e) {
    items = [];
  }

  const isQuote = inv.type === "Quote";
  const isPaid = inv.status === "Paid";

  return (
    <div className="w-full bg-slate-50 py-6 sm:py-10 print:py-0 print:bg-white min-h-screen">
      {/* Top Floating Action Bar (Hidden on print) */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 mb-6 print:hidden">
        <InvoiceActionButtons
          invoiceId={inv.id}
          invoiceNumber={inv.invoice_number}
          type={inv.type}
          clientName={inv.client_name}
          clientPhone={inv.client_phone}
          totalAmount={inv.total_amount}
        />
      </div>

      {/* Main Document Box */}
      <div className="w-full max-w-[960px] mx-auto bg-white rounded-3xl print:rounded-none border border-slate-200 print:border-none shadow-xl print:shadow-none p-6 sm:p-12 space-y-8 printable-document print:p-0 print:space-y-6">
        {/* 1. LETTERHEAD HEADER */}
        <div className="border-b-2 border-slate-900 pb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-brand-yellow via-brand-coral to-brand-cyan shrink-0">
              <div className="w-full h-full bg-white rounded-full p-1.5 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Yellow Ribbon Travels"
                  width={56}
                  height={56}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div>
              <span className="font-black text-2xl tracking-tight text-slate-950 block">
                YELLOW RIBBON TRAVELS
              </span>
              <p className="text-xs text-amber-600 font-bold uppercase tracking-widest">
                Tailored Holidays • Wholesale Flights • Global Concierge
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                2-2-51, Shop No. 2, Mittal Chambers, M.G. Road, Secunderabad, Telangana - 500003
              </p>
              <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                GSTIN: <span className="font-mono">36AAECY9102K1Z5</span>
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 sm:text-right space-y-1">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1 ${
                isQuote
                  ? "bg-cyan-100 text-cyan-800"
                  : isPaid
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isQuote ? "Custom Quotation / Estimate" : isPaid ? "Tax Invoice (PAID)" : "Tax Invoice"}
            </span>
            <div>
              Document No: <strong className="font-mono text-slate-900 font-bold">{inv.invoice_number}</strong>
            </div>
            <div>Date of Issue: {new Date(inv.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</div>
            {inv.due_date && <div>Due Date: {new Date(inv.due_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</div>}
            <div className="pt-1 text-[11px] text-slate-400">
              India • UAE • UK • Singapore
            </div>
          </div>
        </div>

        {/* 2. BILLED TO / CLIENT DETAILS */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Billed To / Prepared For:
            </span>
            <div className="font-black text-base text-slate-900">{inv.client_name}</div>
            <div className="text-slate-600 mt-1">{inv.client_phone}</div>
            {inv.client_email && <div className="text-slate-500">{inv.client_email}</div>}
            {inv.client_address && <div className="text-slate-600 mt-1 max-w-sm">{inv.client_address}</div>}
          </div>

          <div className="sm:text-right space-y-1 sm:border-l sm:border-slate-200 sm:pl-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Payment Terms & Currency:
            </span>
            <div>Currency: <strong>{inv.currency} (Indian Rupees)</strong></div>
            <div>Status: <strong className={isPaid ? "text-emerald-600 font-bold" : "text-amber-600"}>{inv.status}</strong></div>
            <div>Payment Gateway: <strong>Razorpay Encrypted Desk</strong></div>
          </div>
        </div>

        {/* 3. ITEMIZED CHARGES TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Description of Services</th>
                <th className="py-3 px-4 text-center">Qty / Pax</th>
                <th className="py-3 px-4 text-right">Unit Rate (₹)</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-4 px-4 font-semibold text-slate-900">{item.description}</td>
                  <td className="py-4 px-4 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-slate-700">₹{item.rate.toLocaleString("en-IN")}</td>
                  <td className="py-4 px-4 text-right font-bold text-slate-950">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. TOTALS BREAKDOWN */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6">
          <div className="text-xs text-slate-500 max-w-sm space-y-2">
            <strong className="text-slate-800 block">Notes & Terms:</strong>
            <p className="leading-relaxed">
              {inv.terms ||
                "Payment is due as per agreed milestone schedule. Rates valid for 10 days from issuance date. All tour bookings subject to Yellow Ribbon Travels standard terms."}
            </p>
          </div>

          <div className="w-full sm:w-72 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{inv.subtotal.toLocaleString("en-IN")}</span>
            </div>

            {inv.tax_amount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>GST ({inv.tax_percent}%):</span>
                <span>₹{inv.tax_amount.toLocaleString("en-IN")}</span>
              </div>
            )}

            {inv.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promotional Discount:</span>
                <span>-₹{inv.discount_amount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-950">
              <span>Total Payable:</span>
              <span className="text-lg text-amber-600">₹{inv.total_amount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* 5. PAYMENT CTA DESK */}
        {!isPaid && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-brand-coral rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg print:hidden">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-yellow-100">
                Quick Online Payment
              </div>
              <h4 className="text-xl font-black">Settle This {inv.type} Instantly</h4>
              <p className="text-xs text-yellow-100 mt-0.5">
                Pay securely via Razorpay using UPI, Credit/Debit Cards, or NetBanking.
              </p>
            </div>

            <Link
              href={`/pay?ref=${encodeURIComponent(inv.invoice_number)}&amount=${inv.total_amount}&name=${encodeURIComponent(
                inv.client_name
              )}`}
              className="px-6 py-3.5 rounded-xl font-black text-xs text-slate-950 bg-white hover:bg-yellow-50 shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Pay ₹{inv.total_amount.toLocaleString("en-IN")} via Razorpay</span>
            </Link>
          </div>
        )}

        {/* 6. SIGN-OFF */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-800">Authorized Signatory</p>
            <p className="text-[11px] text-slate-400">Yellow Ribbon Travels Private Limited</p>
          </div>
          <div className="sm:text-right">
            <p>Direct Support: +91 91002 28152 | yellowribbontravels@gmail.com</p>
            <p className="text-[11px] text-slate-400">This is a computer-generated authenticated document.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
