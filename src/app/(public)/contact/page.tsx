import { branchService } from "@/modules/branches/service/branch.service";
import ContactView from "@/modules/contact/components/ContactView";
import BranchCard from "@/modules/branches/components/BranchCard";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { MapPin, Phone, Mail, Clock, PhoneCall, ShieldCheck, Compass } from "lucide-react";
import Link from "next/link";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";

export const revalidate = 60;

export const metadata = {
  title: "Contact Us & Branch Locations | Yellow Ribbon Travels",
  description:
    "Get in touch with Yellow Ribbon Travels. Visit our Head Office in Secunderabad or branches in Chennai, Pune, Dahod, and Patna.",
};

export default async function ContactPage() {
  const branches = await branchService.getActiveBranches();

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-12 sm:space-y-16">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
          <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" /> <span>24/7 Travel Desk & Direct Branch Access</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Get in Touch With Our Travel Architects
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Whether you are planning a family trip, booking urgent flights, or need visa consultation, our team across 8 domestic and global branches is ready to assist.
        </p>
      </div>

      {/* Main Grid: Nearest Branch Finder + Contact Form + Local Office Card */}
      <ContactView branches={branches} />

      {/* Branches Overview Section */}
      <div className="space-y-6 pt-10 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Our Domestic & Global Branch Network
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Visit our offices in person across India, UAE, UK, and Singapore for face-to-face consultation and visa paperwork.
            </p>
          </div>

          <Link
            href="/branches"
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 underline flex items-center gap-1"
          >
            <span>Explore Interactive Map Page</span>
            <span>➔</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7 sm:gap-8 w-full">
          {branches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      </div>
    </div>
  );
}
