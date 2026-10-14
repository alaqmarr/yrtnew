import { userService } from "@/modules/users/service/user.service";
import InitialSetupWizard from "@/modules/setup/components/InitialSetupWizard";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";

export const metadata = {
  title: "Initial System Setup | Yellow Ribbon Travels",
  description:
    "Initial system onboarding and primary administrator account creation wizard for Yellow Ribbon Travels.",
};

export default async function SetupPage() {
  const hasAdmin = await userService.hasAnyAdmin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />

      {hasAdmin ? (
        // Setup Already Completed View (Route Sealed)
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-brand-yellow via-brand-coral to-brand-cyan mx-auto shadow-md">
            <div className="w-full h-full bg-white rounded-full p-1.5 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Yellow Ribbon Travels"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Initial Setup Sealed</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Setup Already Completed
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              An active administrator account already exists in the database. For security reasons, the initial setup route is sealed.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/login"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-brand-yellow to-amber-400 hover:from-amber-400 hover:to-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Sign In to Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Admin Authorization Protected</span>
          </div>
        </div>
      ) : (
        // Initial Admin Setup Wizard
        <InitialSetupWizard />
      )}
    </div>
  );
}
