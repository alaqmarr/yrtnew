import PayOnlinePortal from "@/modules/payments/components/PayOnlinePortal";
import { FlaskConical, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Razorpay Test Gateway (Sandbox) | Yellow Ribbon Travels Beta Desk",
  description:
    "Test payment desk for Yellow Ribbon Travels utilizing Razorpay sandbox credentials. Verify UPI, Test Cards, and simulated transactions without real money.",
};

export default function BetaPayPage() {
  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-12">
      {/* Beta Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-500/30">
          <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
          <span>Beta Sandbox Environment • Test Mode Enforced</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
          Razorpay Test Payment Desk
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          This portal strictly uses your database-configured <strong>Razorpay Test Credentials</strong> (<code className="font-mono text-amber-800 bg-amber-100/60 px-1 py-0.5 rounded">razorpay_key_id_test</code>). No actual credit card or bank funds will be deducted.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/beta"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 transition-colors"
          >
            ← View All Beta Test Cases
          </Link>
          <Link
            href="/pay"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            Switch to Public Live /pay Portal →
          </Link>
        </div>
      </div>

      {/* Main Payment Portal strictly in test mode */}
      <PayOnlinePortal isTest={true} />
    </div>
  );
}
