import { notFound } from "next/navigation";
import Link from "next/link";
import { paymentService } from "@/modules/payments/service/payment.service";
import RazorpayCheckoutButton from "@/modules/payments/components/RazorpayCheckoutButton";
import PrintReceiptButton from "@/modules/payments/components/PrintReceiptButton";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Printer,
  FileText,
  AlertCircle,
  Share2,
  Lock,
  PhoneCall,
  User,
  Mail,
  Receipt,
  Sparkles,
} from "lucide-react";

type RouteProps = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: RouteProps) {
  const { code } = await params;
  const link = await paymentService.getPaymentLinkByCode(code);
  if (!link) return { title: "Payment Not Found | Yellow Ribbon Travels" };
  return {
    title: `Pay ₹${link.amount.toLocaleString("en-IN")} for ${link.purpose} | Yellow Ribbon Travels`,
    description: `Official secure payment link for ${link.customer_name}. Total: ₹${link.amount.toLocaleString("en-IN")}.`,
  };
}

export default async function PaymentLinkDetailPage({ params }: RouteProps) {
  const { code } = await params;
  const link = await paymentService.getPaymentLinkByCode(code);

  if (!link) {
    return (
      <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Payment Link Not Found</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          The payment link code <code className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{code}</code> does not exist or has expired.
        </p>
        <div className="pt-2">
          <Link
            href="/pay"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Payment Desk</span>
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = link.status === "paid";

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-8">
      {/* Top Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Pay Online", href: "/pay" },
          { label: `Invoice ${link.link_code}` },
        ]}
      />

      {/* Top Banner Header - Expansive Full Width */}
      <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 opacity-90" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3.5 py-1 rounded-full">
                {link.link_code}
              </span>
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isPaid
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                }`}
              >
                {isPaid ? "✓ Paid & Verified" : "● Payment Pending"}
              </span>
              <span className="text-xs text-slate-400">
                Created: {new Date(link.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight">
              {link.purpose}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              Prepared for: <strong className="text-white font-bold">{link.customer_name}</strong>
              {link.customer_phone && <span className="text-slate-400"> • {link.customer_phone}</span>}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col items-start lg:items-end justify-center shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Total Amount
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              ₹{link.amount.toLocaleString("en-IN")}{" "}
              <span className="text-sm font-semibold text-slate-300">INR</span>
            </div>
            <span className="text-[11px] text-emerald-300 font-medium mt-1">
              ✓ All Taxes & GST Included
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Full-Width Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer & Inclusions Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Booking Summary Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Booking & Traveler Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official booking reference and customer itinerary records
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Ref: {link.link_code}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-1">
                <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">
                  Primary Traveler
                </span>
                <span className="font-bold text-slate-900 text-sm">{link.customer_name}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-1">
                <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">
                  WhatsApp Helpline
                </span>
                <span className="font-bold text-slate-900 text-sm">{link.customer_phone}</span>
              </div>

              {link.customer_email && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-1 sm:col-span-2">
                  <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">
                    Email for GST Receipt
                  </span>
                  <span className="font-semibold text-slate-800">{link.customer_email}</span>
                </div>
              )}
            </div>

            {/* Inclusions / Notes Description */}
            {link.description && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Trip Inclusions & Payment Notes:
                </span>
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {link.description}
                </div>
              </div>
            )}

            {/* Settlement Details if Paid */}
            {isPaid && link.razorpay_payment_id && (
              <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Transaction Completed & Settled</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-500 block">Razorpay Payment ID:</span>
                    <span className="font-mono font-bold text-slate-900">{link.razorpay_payment_id}</span>
                  </div>
                  {link.paid_at && (
                    <div>
                      <span className="text-slate-500 block">Settled Timestamp:</span>
                      <span className="font-medium text-slate-900">{new Date(link.paid_at).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Yellow Ribbon Official Verification Banner */}
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  Yellow Ribbon Travels Official Booking Desk
                </h4>
                <p className="text-xs text-slate-500">
                  Secunderabad Head Office • Registered Indian Tour Operator
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every payment processed through this link is directly credited to the official Yellow Ribbon Travels business account with instant confirmation and a computerized tax invoice issued upon settlement.
            </p>
          </div>
        </div>

        {/* Right Column: Checkout Action & Security (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Amount Payable
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-950">
                ₹{link.amount.toLocaleString("en-IN")}{" "}
                <span className="text-sm font-bold text-slate-500">INR</span>
              </div>
              <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Zero Gateway Surcharge (100% Waived)
              </div>
            </div>

            {/* Action Area */}
            {isPaid ? (
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Payment Fully Completed</span>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <PrintReceiptButton
                    receiptData={{
                      linkCode: link.link_code,
                      customerName: link.customer_name,
                      customerPhone: link.customer_phone,
                      customerEmail: link.customer_email || undefined,
                      purpose: link.purpose,
                      description: link.description,
                      amount: link.amount,
                      currency: link.currency,
                      status: link.status,
                      paymentId: link.razorpay_payment_id,
                      paidAt: link.paid_at,
                      createdAt: link.created_at,
                    }}
                  />

                  <Link
                    href={`/receipt/${link.link_code}`}
                    target="_blank"
                    className="w-full py-2.5 rounded-2xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Official Receipt in Full Tab</span>
                  </Link>

                  <a
                    href={`https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20payment%20link%20${link.link_code}%20has%20been%20settled.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center gap-2 transition-transform hover:scale-102"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                    <span>WhatsApp Tour Manager</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <RazorpayCheckoutButton
                  amount={link.amount}
                  currency={link.currency}
                  purpose={link.purpose}
                  customerName={link.customer_name}
                  customerEmail={link.customer_email || ""}
                  customerPhone={link.customer_phone}
                  linkCode={link.link_code}
                  buttonText={`Pay ₹${link.amount.toLocaleString("en-IN")} via Razorpay`}
                  className="w-full py-4 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-brand-yellow via-amber-500 to-amber-600 hover:opacity-95 shadow-xl shadow-amber-500/25 transition-transform hover:scale-102"
                />

                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> UPI / Cards / NetBanking
                  </span>
                  <span>•</span>
                  <span>Instant Receipt</span>
                </div>
              </div>
            )}

            {/* Bank Security Badges */}
            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted Razorpay Gateway</span>
              </div>
              <ul className="space-y-2 text-slate-500 text-[11px]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Supports Google Pay, PhonePe, Paytm & all UPI apps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Visa, MasterCard, RuPay, Amex & NetBanking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Computerized tax receipt generated immediately</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Secured by Razorpay</span>
                <span>PCI-DSS Level 1 Certified</span>
              </div>
            </div>
          </div>

          {/* Need Help Card */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/80 space-y-3">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>Need Payment Assistance?</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              If your bank transaction fails or you need help with credit limit approvals, our Secunderabad accounts team is on call.
            </p>
            <a
              href="tel:+919100228152"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700"
            >
              <span>Call Helpline: +91 91002 28152</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
