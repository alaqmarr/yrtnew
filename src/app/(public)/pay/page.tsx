import PayOnlinePortal from "@/modules/payments/components/PayOnlinePortal";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { ShieldCheck, CreditCard, Lock, Sparkles } from "lucide-react";

export const metadata = {
  title: "Pay Online with Razorpay | Yellow Ribbon Travels Official Payment Portal",
  description:
    "Secure online payments for holiday packages, flight tickets, hotel deposits, and custom itineraries via Razorpay. Supports UPI, Cards, NetBanking with instant GST receipts.",
};

export default function PayPage() {
  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <Breadcrumbs items={[{ label: "Pay Online (Razorpay)" }]} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Official 256-Bit Encrypted Payment Desk</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
          Pay Online Seamlessly
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Pay deposits, advance bookings, or settle your balance using UPI, Credit/Debit Cards, or NetBanking directly through our verified Razorpay gateway.
        </p>
      </div>

      {/* Main Payment Portal */}
      <PayOnlinePortal />
    </div>
  );
}
