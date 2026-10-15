"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  Utensils,
  KeyRound,
  Edit2,
  Trash2,
  AlertTriangle,
  Heart,
  Baby,
  Smile,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { FamilyMember, FamilyRelationship, AgeGroup } from "../domain/family.entity";
import { ClientProfile } from "@/modules/account/domain/account.entity";
import FamilyMemberModal from "./FamilyMemberModal";
import CreateSubAccountModal from "./CreateSubAccountModal";

interface FamilyHubProps {
  isFamilyHead: boolean;
  familyHead?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
  familyMembers: FamilyMember[];
  profile: ClientProfile;
  onFamilyUpdated?: (members: FamilyMember[]) => void;
}

export default function FamilyHub({
  isFamilyHead,
  familyHead,
  familyMembers: initialFamilyMembers,
  profile,
  onFamilyUpdated,
}: FamilyHubProps) {
  const [members, setMembers] = useState<FamilyMember[]>(initialFamilyMembers || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [accountTargetMember, setAccountTargetMember] = useState<FamilyMember | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterRelationship, setFilterRelationship] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleMemberSaved = (savedMember: FamilyMember) => {
    let updated: FamilyMember[];
    const exists = members.some((m) => m.id === savedMember.id);
    if (exists) {
      updated = members.map((m) => (m.id === savedMember.id ? savedMember : m));
      showNotification(`Updated travel profile for ${savedMember.name}.`);
    } else {
      updated = [savedMember, ...members];
      showNotification(`Added ${savedMember.name} to your family travel group.`);
    }
    setMembers(updated);
    if (onFamilyUpdated) onFamilyUpdated(updated);
  };

  const handleAccountCreated = (updatedMember: FamilyMember) => {
    const updated = members.map((m) => (m.id === updatedMember.id ? updatedMember : m));
    setMembers(updated);
    if (onFamilyUpdated) onFamilyUpdated(updated);
    showNotification(`Sub-account created for ${updatedMember.name}! They can now log in.`);
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from your family group?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/account/family/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to remove member");
      }
      const updated = members.filter((m) => m.id !== id);
      setMembers(updated);
      if (onFamilyUpdated) onFamilyUpdated(updated);
      showNotification(`Removed ${name} from family group.`);
    } catch (err: any) {
      alert(err.message || "Failed to remove member");
    } finally {
      setDeletingId(null);
    }
  };

  // Passport expiration check (< 6 months)
  const isPassportExpiringSoon = (expiryDate?: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffMonths = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
    return diffMonths < 6;
  };

  const isPassportExpired = (expiryDate?: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate).getTime() < new Date().getTime();
  };

  // Filter & Search
  const filteredMembers = members.filter((m) => {
    const matchesFilter =
      filterRelationship === "all" ||
      m.relationship?.toLowerCase() === filterRelationship.toLowerCase() ||
      m.age_group?.toLowerCase() === filterRelationship.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.passport_number?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalAdults = members.filter((m) => m.age_group === "Adult").length + 1; // +1 for primary user
  const totalChildren = members.filter((m) => m.age_group === "Child" || m.age_group === "Infant").length;
  const activeSubAccounts = members.filter((m) => Boolean(m.member_user_id)).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TOP BANNER */}
      {isFamilyHead ? (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 text-white shadow-xl border border-white/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                  Primary Family Head
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/15 text-white/90">
                  Full Family Visibility Enabled
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Family & Co-Travelers Hub
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Manage travel profiles, passports, and dietary preferences for your entire family.
                You can also create independent logins for family members so they can view their own bookings while you retain full group visibility.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingMember(null);
                setIsAddModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2.5 hover:scale-105 active:scale-95 shrink-0"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Family Member</span>
            </button>
          </div>

          {/* Quick Counter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-xs font-semibold text-slate-400">Total Group Size</div>
              <div className="text-2xl font-black text-white mt-1">{members.length + 1} Persons</div>
              <div className="text-[11px] text-amber-400 font-medium">Head + {members.length} members</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-xs font-semibold text-slate-400">Adult Travelers</div>
              <div className="text-2xl font-black text-white mt-1">{totalAdults}</div>
              <div className="text-[11px] text-slate-400">Age 12+</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-xs font-semibold text-slate-400">Children & Infants</div>
              <div className="text-2xl font-black text-white mt-1">{totalChildren}</div>
              <div className="text-[11px] text-slate-400">Under 12 years</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-xs font-semibold text-slate-400">Active Sub-Accounts</div>
              <div className="text-2xl font-black text-white mt-1">{activeSubAccounts}</div>
              <div className="text-[11px] text-emerald-400 font-medium">Independent logins</div>
            </div>
          </div>
        </div>
      ) : (
        /* Sub-Account View Banner */
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-xl border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Family Sub-Account
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Personal Travel Account
              </h2>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                You are registered as a family member linked to primary account holder{" "}
                <span className="font-semibold text-white">
                  {familyHead?.name || "Family Head"}
                </span>
                {familyHead?.email ? ` (${familyHead.email})` : ""}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-xs text-slate-200 max-w-xs space-y-1 shrink-0">
              <div className="font-bold flex items-center gap-1 text-amber-300">
                <Info className="w-4 h-4" />
                <span>Data Isolation Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Your portal shows only your personal bookings, flights, and tickets. Your profile remains private from non-family travelers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH BAR (Family Head only) */}
      {isFamilyHead && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
              Filter:
            </span>
            {["all", "Spouse", "Child", "Parent", "Adult"].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterRelationship(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filterRelationship === filter
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {filter === "all" ? "All Members" : filter}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search member, email, passport..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* FAMILY MEMBERS LIST */}
      {isFamilyHead && (
        <div className="space-y-4">
          {/* Primary User Card (The Family Head) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border-2 border-amber-400/40 shadow-md relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {profile.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                      Primary Head
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {profile.email}
                    </span>
                    {profile.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {profile.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Primary Admin Account
                </span>
              </div>
            </div>
          </div>

          {/* Member Cards */}
          {filteredMembers.length === 0 ? (
            <div className="p-10 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {members.length === 0 ? "No Family Members Added Yet" : "No matching members found"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {members.length === 0
                    ? "Add your spouse, children, parents, or co-travelers to easily auto-fill bookings and give them their own login accounts."
                    : "Try adjusting your search query or filter selection."}
                </p>
              </div>
              {members.length === 0 && (
                <button
                  onClick={() => {
                    setEditingMember(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add First Family Member</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMembers.map((member) => {
                const expiringSoon = isPassportExpiringSoon(member.passport_expiry);
                const expired = isPassportExpired(member.passport_expiry);

                return (
                  <div
                    key={member.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    {/* Top Row: Avatar & Basic Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-amber-400 font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                          {member.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                              {member.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              {member.relationship}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {member.age_group}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            {member.gender && <span>{member.gender}</span>}
                            {member.date_of_birth && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {member.date_of_birth}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingMember(member);
                            setIsAddModalOpen(true);
                          }}
                          className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                          title="Edit member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          disabled={deletingId === member.id}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-40"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Middle: Travel & Contact Details */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-2.5">
                      {/* Contacts */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 dark:text-slate-300">
                        {member.email ? (
                          <span className="flex items-center gap-1.5 truncate max-w-full">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No email provided</span>
                        )}
                        {member.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{member.phone}</span>
                          </span>
                        )}
                      </div>

                      {/* Travel Credentials */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        <div>
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Passport
                          </div>
                          <div className="font-mono font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                            {member.passport_number || "Not on file"}
                          </div>
                          {member.passport_expiry && (
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Exp: {member.passport_expiry}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Meal Preference
                          </div>
                          <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                            <Utensils className="w-3 h-3 text-amber-500" />
                            <span className="truncate">{member.dietary_preference || "Any"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Passport Warning */}
                      {member.passport_number && (expired || expiringSoon) && (
                        <div
                          className={`p-2 rounded-xl text-[11px] font-semibold flex items-center gap-2 ${
                            expired
                              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50"
                              : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50"
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {expired
                              ? "Passport has expired! Please renew before booking international travel."
                              : "Passport expires within 6 months. May need renewal for international trips."}
                          </span>
                        </div>
                      )}

                      {/* Notes */}
                      {member.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                          &ldquo;{member.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Bottom: Sub-Account Login Status */}
                    <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                      {member.member_user_id ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                          <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Sub-Account Active</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAccountTargetMember(member)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 transition-all cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Enable Separate Login</span>
                        </button>
                      )}

                      <span className="text-[11px] text-slate-400">
                        {member.nationality || "Indian"} Citizen
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-ACCOUNT USER PROFILE & TRAVEL CREDENTIALS CARD */}
      {!isFamilyHead && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Your Personal Travel Profile
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your login is managed as part of the family group led by{" "}
            <strong>{familyHead?.name || "Family Head"}</strong>. Any bookings created under your name or email will automatically appear in your portal.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Logged in Name</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{profile.name}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Email Address</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">{profile.email}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
              <div className="text-xs text-slate-400 font-medium">Relationship</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                {profile.relationship_to_head || "Family Member"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <FamilyMemberModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMember(null);
        }}
        onSaved={handleMemberSaved}
        editingMember={editingMember}
      />

      <CreateSubAccountModal
        isOpen={Boolean(accountTargetMember)}
        onClose={() => setAccountTargetMember(null)}
        member={accountTargetMember}
        onAccountCreated={handleAccountCreated}
      />
    </div>
  );
}
