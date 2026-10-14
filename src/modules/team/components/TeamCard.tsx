import Image from "next/image";
import { TeamMember } from "../domain/team.entity";
import { Mail, Phone } from "lucide-react";

interface TeamCardProps {
  member: TeamMember;
}

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col group">
      <div className="relative aspect-[4/4] overflow-hidden bg-slate-100">
        <Image
          src={member.image_url}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="flex items-center gap-2">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone.replace(/\s+/g, "")}`}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                title="Call Directly"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-1">
          {member.department}
        </span>
        <h3 className="font-bold text-lg text-slate-900 leading-snug">
          {member.name}
        </h3>
        <span className="text-xs font-medium text-slate-500 mb-3">
          {member.designation}
        </span>

        <p className="text-xs text-slate-600 leading-relaxed mt-auto pt-3 border-t border-slate-100">
          {member.bio}
        </p>
      </div>
    </div>
  );
}
