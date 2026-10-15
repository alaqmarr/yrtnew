import { branchService } from "@/modules/branches/service/branch.service";
import BranchesView from "@/modules/branches/components/BranchesView";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { MapPin, PhoneCall, Building2, ShieldCheck, Globe2 } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Branch Offices Across India & Worldwide | Yellow Ribbon Travels",
  description:
    "Find our offices in Secunderabad (Hyderabad), Chennai, Pune, Dahod, Patna, plus our international branches in Dubai (UAE), London (UK), and Singapore.",
};

export default async function BranchesPage() {
  const branches = await branchService.getActiveBranches();

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-12 sm:space-y-16">
      <Breadcrumbs items={[{ label: "Global Branch Offices" }]} />
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
          <Globe2 className="w-3.5 h-3.5 text-cyan-600" /> Worldwide & Domestic Network
        </div>
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-950 tracking-tight">
          Global Offices & Branch Network
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          From our Secunderabad headquarters to our pan-India hubs and overseas offices in Dubai, London, and Singapore, walk into any Yellow Ribbon Travels branch for personalized, one-on-one travel consultation.
        </p>
      </div>

      {/* Interactive Tabs & Grid */}
      <BranchesView branches={branches} />


      {/* Walk-in Assurances */}
      <div className="bg-gradient-to-br from-amber-50/75 via-white to-cyan-50/65 rounded-3xl p-8 sm:p-12 border border-amber-200/70 max-w-4xl mx-auto space-y-6 shadow-xs">
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-bold text-slate-900">
            Why Visit a Yellow Ribbon Branch?
          </h3>
          <p className="text-xs text-slate-500">
            Enjoy the comfort of dealing with an authorized local team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="bg-gradient-to-br from-white via-amber-50/40 to-amber-100/25 p-5 rounded-2xl border border-amber-200/70 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Physical Presence</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real brick-and-mortar offices with registered trade licenses and accountable branch managers.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white via-cyan-50/40 to-cyan-100/25 p-5 rounded-2xl border border-cyan-200/70 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Visa Paperwork Help</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Drop off your passport and visa documents in person for safe physical biometric and embassy handling.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/25 p-5 rounded-2xl border border-emerald-200/70 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Local Language Support</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our teams communicate fluently in Telugu, Hindi, Tamil, Marathi, Gujarati, and English.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
