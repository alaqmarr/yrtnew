"use client";

import { useState, useMemo } from "react";
import { Branch } from "../domain/branch.entity";
import BranchCard from "./BranchCard";
import NearestBranchFinder from "./NearestBranchFinder";
import {
  Globe2,
  Search,
  MapPin,
  Sparkles,
  Building2,
  Navigation,
  ArrowUpDown,
} from "lucide-react";
import { BranchWithDistance, UserLocation } from "../utils/geo";

interface BranchesViewProps {
  branches: Branch[];
}

export default function BranchesView({ branches }: BranchesViewProps) {
  const [filter, setFilter] = useState<"all" | "domestic" | "international">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rankedBranches, setRankedBranches] = useState<BranchWithDistance[] | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [sortByDistance, setSortByDistance] = useState<boolean>(true);

  const handleRankedChange = (
    ranked: BranchWithDistance[] | null,
    loc: UserLocation | null
  ) => {
    setRankedBranches(ranked);
    setUserLocation(loc);
  };

  const distanceMap = useMemo(() => {
    const map = new Map<string, BranchWithDistance>();
    if (rankedBranches) {
      for (const b of rankedBranches) {
        map.set(b.id, b);
      }
    }
    return map;
  }, [rankedBranches]);

  const branchesToRender = useMemo(() => {
    if (sortByDistance && rankedBranches && rankedBranches.length > 0) {
      return rankedBranches;
    }
    return branches;
  }, [branches, rankedBranches, sortByDistance]);

  const domesticBranches = useMemo(
    () => branches.filter((b) => !b.is_international),
    [branches]
  );
  const intlBranches = useMemo(
    () => branches.filter((b) => b.is_international),
    [branches]
  );

  const displayedBranches = useMemo(() => {
    let list =
      filter === "domestic"
        ? domesticBranches
        : filter === "international"
        ? intlBranches
        : branches;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.city.toLowerCase().includes(q) ||
          b.state.toLowerCase().includes(q) ||
          b.country.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q)
      );
    }

    return list;
  }, [branches, domesticBranches, intlBranches, filter, searchQuery]);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Nearest Branch Finder Spotlight & Geolocation Prompt */}
      <NearestBranchFinder
        branches={branches}
        onRankedBranchesChange={handleRankedChange}
      />

      {/* Search & Filter Controls Bar with Distance Sort Option */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/75 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs ${
              filter === "all"
                ? "bg-slate-900/90 text-white backdrop-blur-md border border-slate-700 shadow-md scale-105"
                : "bg-white/75 hover:bg-white text-slate-700 backdrop-blur-sm border border-slate-200 hover:border-slate-300"
            }`}
          >
            All Offices ({branches.length})
          </button>

          <button
            onClick={() => setFilter("domestic")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              filter === "domestic"
                ? "bg-amber-500/90 text-white backdrop-blur-md border border-amber-400 shadow-md scale-105"
                : "bg-white/75 hover:bg-white text-slate-700 backdrop-blur-sm border border-slate-200 hover:border-slate-300"
            }`}
          >
            <span>🇮🇳</span>
            <span>India ({domesticBranches.length})</span>
          </button>

          <button
            onClick={() => setFilter("international")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              filter === "international"
                ? "bg-cyan-600/90 text-white backdrop-blur-md border border-cyan-500 shadow-md scale-105"
                : "bg-white/75 hover:bg-white text-slate-700 backdrop-blur-sm border border-slate-200 hover:border-slate-300"
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>International ({intlBranches.length})</span>
          </button>

          {/* Distance Sorting Toggle if Location is available */}
          {userLocation && (
            <button
              onClick={() => setSortByDistance(!sortByDistance)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                sortByDistance
                  ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-sm"
                  : "bg-white/75 hover:bg-white text-slate-600 border border-slate-200"
              }`}
              title="Sort branches closest first"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>{sortByDistance ? "Sorted: Closest First" : "Sort by Distance"}</span>
            </button>
          )}
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, state, country..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of Map-Integrated Cards - Persistent DOM keeps iframes loaded & warm with 0ms tab shuffle */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7 sm:gap-8 w-full">
        {branchesToRender.map((branch) => {
          const isCategoryMatch =
            filter === "all"
              ? true
              : filter === "domestic"
              ? !branch.is_international
              : branch.is_international;

          const isSearchMatch =
            !searchQuery.trim() ||
            branch.city.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
            branch.state.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
            branch.country.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
            branch.address.toLowerCase().includes(searchQuery.toLowerCase().trim());

          const isVisible = isCategoryMatch && isSearchMatch;
          const distInfo = distanceMap.get(branch.id);

          return (
            <div
              key={branch.id}
              className={isVisible ? "h-full" : "hidden"}
            >
              <BranchCard
                branch={branch}
                distanceFormatted={distInfo?.distanceFormatted}
                estimatedDriveTime={distInfo?.estimatedDriveTime}
                isClosest={distInfo?.isClosest}
                userCoords={userLocation?.coords}
              />
            </div>
          );
        })}
      </div>

      {displayedBranches.length === 0 && (
        <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 space-y-3">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No Branch Offices Found</h4>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            We couldn't find any branch matching "{searchQuery}". Try searching for another city or clear your search filter.
          </p>
          <button
            onClick={() => {
              setFilter("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
