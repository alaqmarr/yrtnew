import { teamService } from "@/modules/team/service/team.service";
import TeamCard from "@/modules/team/components/TeamCard";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { Users, Sparkles, Mail } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Meet Our Team & Travel Specialists | Yellow Ribbon Travels",
  description:
    "Meet the experienced travel curators, flight specialists, and customer champions behind Yellow Ribbon Travels.",
};

export default async function TeamPage() {
  const team = await teamService.getAllTeam();

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-12 sm:space-y-16">
      <Breadcrumbs items={[{ label: "Our Team" }]} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
          <Users className="w-3.5 h-3.5" /> Destination Experts
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Meet The Faces Behind Your Journeys
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From certified flight ticketing authorities to veteran destination specialists who have traversed the valleys of Kashmir and the temples of Bali, meet our passionate team.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-8">
        {team.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>

      {/* Careers Callout */}
      <div className="bg-gradient-to-br from-amber-50/75 via-white to-cyan-50/60 rounded-3xl p-8 sm:p-12 border border-amber-200/70 text-center max-w-3xl mx-auto space-y-4 shadow-xs">
        <h3 className="text-2xl font-bold text-slate-900">
          Love Traveling? Join Our Growing Family
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          We are continuously on the lookout for talented tour designers, ticketing associates, and branch consultants across our 5 locations.
        </p>
        <a
          href="mailto:yellowribbontravels@gmail.com?subject=Career%20Inquiry%20-%20Yellow%20Ribbon%20Travels"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>Send Your CV: yellowribbontravels@gmail.com</span>
        </a>
      </div>
    </div>
  );
}
