"use client";

import { useState, useEffect, useCallback } from "react";
import { Branch } from "../domain/branch.entity";
import {
  Coordinates,
  UserLocation,
  BranchWithDistance,
  rankBranchesByProximity,
  POPULAR_USER_CITIES,
  getDirectNavigationUrl,
} from "../utils/geo";
import {
  MapPin,
  Navigation,
  Compass,
  Phone,
  Clock,
  Sparkles,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import IOSSpinner from "@/shared/components/IOSSpinner";

const STORAGE_KEY = "yrt_user_location";

interface NearestBranchFinderProps {
  branches: Branch[];
  onRankedBranchesChange?: (
    ranked: BranchWithDistance[] | null,
    userLocation: UserLocation | null
  ) => void;
  compact?: boolean;
}

export default function NearestBranchFinder({
  branches,
  onRankedBranchesChange,
  compact = false,
}: NearestBranchFinderProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [closestBranch, setClosestBranch] = useState<BranchWithDistance | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [selectedCityLabel, setSelectedCityLabel] = useState<string>("");

  // Process coordinates and update state + parent
  const applyCoordinates = useCallback(
    (coords: Coordinates, source: "gps" | "manual", cityName?: string) => {
      const { closestBranch: nearest, rankedBranches } = rankBranchesByProximity(
        coords,
        branches
      );
      const loc: UserLocation = {
        coords,
        source,
        city: cityName || nearest?.city || "Your Location",
        timestamp: Date.now(),
      };

      setUserLocation(loc);
      setClosestBranch(nearest);
      setErrorMsg(null);

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
      } catch (err) {
        console.error("Failed to save location", err);
      }

      if (onRankedBranchesChange) {
        onRankedBranchesChange(rankedBranches, loc);
      }
    },
    [branches, onRankedBranchesChange]
  );

  // Restore saved location or check silent permission on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: UserLocation = JSON.parse(saved);
        // If saved within the last 7 days, restore it
        if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          applyCoordinates(parsed.coords, parsed.source, parsed.city);
          return;
        }
      }

      // Check if browser permission is already granted
      if (typeof window !== "undefined" && "permissions" in navigator) {
        navigator.permissions
          .query({ name: "geolocation" as PermissionName })
          .then((permissionStatus) => {
            if (permissionStatus.state === "granted") {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  applyCoordinates(
                    {
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude,
                    },
                    "gps",
                    "Detected Location"
                  );
                },
                () => {
                  // Silent ignore on background check
                },
                { timeout: 8000, maximumAge: 300000 }
              );
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      // LocalStorage access or permission error safe ignore
    }
  }, [applyCoordinates]);

  // Request browser geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser. Please choose your city below.");
      setShowCityPicker(true);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        applyCoordinates(
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          "gps",
          "Your Current Location"
        );
      },
      (error) => {
        setLoading(false);
        let msg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission was denied. You can select your closest city below instead.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Location signal unavailable. Please pick your city below.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Location request timed out. Please select your city below.";
        }
        setErrorMsg(msg);
        setShowCityPicker(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Clear detected location
  const handleResetLocation = () => {
    setUserLocation(null);
    setClosestBranch(null);
    setErrorMsg(null);
    setShowCityPicker(false);
    setSelectedCityLabel("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    if (onRankedBranchesChange) {
      onRankedBranchesChange(null, null);
    }
  };

  // Manual city selection
  const handleSelectCity = (city: (typeof POPULAR_USER_CITIES)[0]) => {
    setSelectedCityLabel(city.label);
    setShowCityPicker(false);
    applyCoordinates(city.coords, "manual", city.label);
  };

  const directionsUrl =
    closestBranch && userLocation
      ? getDirectNavigationUrl(userLocation.coords, closestBranch)
      : closestBranch?.google_maps_url || "#";

  const phoneClean = closestBranch?.phone.replace(/[^0-9]/g, "") || "";

  return (
    <div className="w-full">
      {/* 1. STATE: LOCATION DETECTED - SHOW SPOTLIGHT CLOSEST BRANCH */}
      {closestBranch && userLocation ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-white/90 to-amber-500/5 backdrop-blur-md border-2 border-amber-400/80 shadow-xl p-5 sm:p-7 transition-all animate-in fade-in slide-in-from-top-3 duration-300">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Column: Nearest Branch Information */}
            <div className="space-y-3 max-w-2xl">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Closest Office To You</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-amber-800 border border-amber-200/80 shadow-xs">
                  <Navigation className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>{closestBranch.distanceFormatted}</span>
                  {closestBranch.estimatedDriveTime && (
                    <span className="text-slate-500 font-medium">
                      ({closestBranch.estimatedDriveTime})
                    </span>
                  )}
                </span>

                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200">
                  Based on: {userLocation.city}
                </span>
              </div>

              {/* Branch Title & Type */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2.5">
                  <span>{closestBranch.city}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {closestBranch.branch_type}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {closestBranch.address}
                </p>
              </div>

              {/* Quick Details Chips */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <a href={`tel:${phoneClean}`} className="hover:text-amber-600">
                    {closestBranch.phone}
                  </a>
                </div>

                {closestBranch.timing && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{closestBranch.timing}</span>
                  </div>
                )}

                {closestBranch.manager_name && (
                  <div className="text-slate-500">
                    Branch Head: <strong className="text-slate-800">{closestBranch.manager_name}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Instant Action Buttons & Reset Controls */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* WhatsApp Local Desk */}
                <a
                  href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                    `Hi Yellow Ribbon Travels ${closestBranch.city} branch, I am located nearby and would like to inquire about tour packages / travel consultation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-md hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Chat With Branch</span>
                </a>

                {/* Turn-by-Turn GPS Directions */}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-all shadow-md hover:-translate-y-0.5"
                >
                  <Navigation className="w-4 h-4 fill-slate-900" />
                  <span>Get Directions</span>
                </a>
              </div>

              {/* Secondary Controls: Switch City or Clear */}
              <div className="flex items-center justify-end gap-3 text-xs text-slate-500 pt-1">
                <button
                  onClick={() => setShowCityPicker(!showCityPicker)}
                  className="hover:text-amber-700 font-semibold underline flex items-center gap-1"
                >
                  <span>Change location</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <span>•</span>
                <button
                  onClick={handleResetLocation}
                  className="hover:text-rose-600 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible City Picker when user clicks "Change location" */}
          {showCityPicker && (
            <div className="mt-5 pt-5 border-t border-amber-200/80 space-y-3 animate-in fade-in duration-200">
              <div className="text-xs font-bold text-slate-700">
                Choose your city to recalculate closest office:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_USER_CITIES.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => handleSelectCity(c)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/90 hover:bg-amber-500 hover:text-slate-950 text-slate-700 border border-slate-200/80 transition-all shadow-2xs"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 2. STATE: UNPROMPTED OR LOCATION NEEDED - PROMPT BANNER */
        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Left Prompt Info */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Find Your Closest Branch Office
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                    GPS Powered
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
                  Allow location access to instantly discover which Yellow Ribbon Travels office is nearest to you, complete with driving distance, local contact info, and Google Maps directions.
                </p>
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={handleDetectLocation}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <IOSSpinner size="sm" color="slate" />
                    <span>Finding Nearest Branch...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 fill-slate-950" />
                    <span>Detect My Location</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors"
              >
                <Compass className="w-4 h-4 text-slate-500" />
                <span>Select City</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                    showCityPicker ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Error Message if Denied */}
          {errorMsg && (
            <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Popular City Selection Chips */}
          {showCityPicker && (
            <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Select your city or region:
                </span>
                <button
                  onClick={() => setShowCityPicker(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕ Close
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_USER_CITIES.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => handleSelectCity(c)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-amber-500 hover:text-slate-950 text-slate-700 border border-slate-200 transition-all shadow-2xs hover:scale-105"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
