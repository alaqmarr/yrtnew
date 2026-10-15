"use client";

import { useState, useMemo, useCallback } from "react";
import { Branch } from "@/modules/branches/domain/branch.entity";
import { BranchWithDistance, UserLocation } from "@/modules/branches/utils/geo";
import NearestBranchFinder from "@/modules/branches/components/NearestBranchFinder";
import BranchCard from "@/modules/branches/components/BranchCard";
import ContactForm from "./ContactForm";
import { Clock, Building2, MapPin, Sparkles } from "lucide-react";

interface ContactViewProps {
  branches: Branch[];
}

export default function ContactView({ branches }: ContactViewProps) {
  const [rankedBranches, setRankedBranches] = useState<BranchWithDistance[] | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const handleRankedChange = useCallback(
    (ranked: BranchWithDistance[] | null, loc: UserLocation | null) => {
      setRankedBranches(ranked);
      setUserLocation(loc);
    },
    []
  );

  const closestBranch = rankedBranches && rankedBranches.length > 0 ? rankedBranches[0] : null;

  // The branch to feature in the right column: closest if detected, otherwise Head Office
  const activeFeaturedBranch = useMemo(() => {
    if (closestBranch) return closestBranch;
    const hq = branches.find((b) => b.branch_type === "Head Office");
    return hq || branches[0] || null;
  }, [closestBranch, branches]);

  const activeBranchDistance = closestBranch ? closestBranch.distanceFormatted : undefined;

  return (
    <div className="space-y-10">
      {/* 1. Geolocation & Closest Branch Spotlight Finder */}
      <NearestBranchFinder
        branches={branches}
        onRankedBranchesChange={handleRankedChange}
      />

      {/* 2. Main Grid: Form on Left, Local Office on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form with default selected branch */}
        <div className="lg:col-span-7">
          <ContactForm
            key={activeFeaturedBranch?.id || "default"}
            branches={branches.map((b) => ({
              id: b.id,
              city: b.city,
              branch_type: b.branch_type,
            }))}
          />
        </div>

        {/* Right Column: Dynamic Local Branch Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>
                {closestBranch ? "Your Closest Branch Office" : "Corporate Headquarters"}
              </span>
            </span>

            {closestBranch && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                ⭐ {closestBranch.distanceFormatted}
              </span>
            )}
          </div>

          {activeFeaturedBranch && (
            <BranchCard
              branch={activeFeaturedBranch}
              distanceFormatted={activeBranchDistance}
              estimatedDriveTime={closestBranch?.estimatedDriveTime}
              isClosest={Boolean(closestBranch)}
              userCoords={userLocation?.coords}
            />
          )}

          {/* Operating Hours Box */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Office Operating Hours</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Monday - Saturday:</span>
              <span className="font-semibold text-slate-900">
                {activeFeaturedBranch?.timing || "9:30 AM - 7:30 PM (IST)"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Sunday Helpline:</span>
              <span className="font-semibold text-emerald-600">Online & WhatsApp Desk Active</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Corporate Email:</span>
              <a href="mailto:yellowribbontravels@gmail.com" className="font-bold text-amber-600 hover:underline">
                yellowribbontravels@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
