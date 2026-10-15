"use client";

import { useState, useEffect } from "react";
import { X, User, Heart, Calendar, ShieldCheck, Mail, Phone, Utensils, KeyRound, Sparkles, Loader2 } from "lucide-react";
import { FamilyMember, FamilyRelationship, AgeGroup } from "../domain/family.entity";

interface FamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (member: FamilyMember) => void;
  editingMember?: FamilyMember | null;
}

const RELATIONSHIPS: FamilyRelationship[] = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Grandparent",
  "In-Law",
  "Relative",
  "Companion",
  "Other",
];

const DIETARY_OPTIONS = [
  "Any / No Restrictions",
  "Vegetarian",
  "Jain Vegetarian",
  "Non-Vegetarian",
  "Halal",
  "Vegan",
  "Gluten-Free",
];

export default function FamilyMemberModal({
  isOpen,
  onClose,
  onSaved,
  editingMember,
}: FamilyMemberModalProps) {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<FamilyRelationship>("Spouse");
  const [gender, setGender] = useState("Female");
  const [dob, setDob] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("Adult");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [dietary, setDietary] = useState("Any / No Restrictions");
  const [notes, setNotes] = useState("");

  // Sub-account creation
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name || "");
      setRelationship(editingMember.relationship || "Spouse");
      setGender(editingMember.gender || "Female");
      setDob(editingMember.date_of_birth || "");
      setAgeGroup(editingMember.age_group || "Adult");
      setEmail(editingMember.email || "");
      setPhone(editingMember.phone || "");
      setPassportNumber(editingMember.passport_number || "");
      setPassportExpiry(editingMember.passport_expiry || "");
      setNationality(editingMember.nationality || "Indian");
      setDietary(editingMember.dietary_preference || "Any / No Restrictions");
      setNotes(editingMember.notes || "");
      setCreateAccount(false);
      setPassword("");
      setConfirmPassword("");
    } else {
      setName("");
      setRelationship("Spouse");
      setGender("Female");
      setDob("");
      setAgeGroup("Adult");
      setEmail("");
      setPhone("");
      setPassportNumber("");
      setPassportExpiry("");
      setNationality("Indian");
      setDietary("Any / No Restrictions");
      setNotes("");
      setCreateAccount(false);
      setPassword("");
      setConfirmPassword("");
    }
    setError("");
  }, [editingMember, isOpen]);

  // Auto-calculate Age Group based on DOB
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const birth = new Date(val);
      const now = new Date();
      const age = now.getFullYear() - birth.getFullYear();
      if (age < 2) setAgeGroup("Infant");
      else if (age < 12) setAgeGroup("Child");
      else setAgeGroup("Adult");
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Member name is required.");
      return;
    }

    if (createAccount && !editingMember) {
      if (!email.trim()) {
        setError("Email is required to create a sub-account.");
        return;
      }
      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const url = editingMember
        ? `/api/account/family/${editingMember.id}`
        : `/api/account/family`;
      const method = editingMember ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          relationship,
          gender,
          date_of_birth: dob || null,
          age_group: ageGroup,
          email: email.trim() || null,
          phone: phone.trim() || null,
          passport_number: passportNumber.trim() || null,
          passport_expiry: passportExpiry || null,
          nationality,
          dietary_preference: dietary,
          notes: notes.trim() || null,
          create_account: !editingMember && createAccount,
          password: !editingMember && createAccount ? password : undefined,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to save family member.");
      }

      const saved = await res.json();
      onSaved(saved);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-4 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Family Travel Group</span>
          </div>
          <h3 className="text-xl font-black mt-1 text-white tracking-tight">
            {editingMember ? "Edit Family Member" : "Add Family Member"}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Store passport details, meal preferences, and enable independent sub-account access.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Personal Information
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Legal Name (as per Passport/Govt ID) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Relationship *
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as FamilyRelationship)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                >
                  {RELATIONSHIPS.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age Category
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                >
                  <option value="Adult">Adult (12+ yrs)</option>
                  <option value="Child">Child (2 - 11 yrs)</option>
                  <option value="Infant">Infant (Under 2 yrs)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="Indian"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Contact & Travel Documents
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya.sharma@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Passport Number
                </label>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. Z1234567"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Passport Expiry Date
                </label>
                <input
                  type="date"
                  value={passportExpiry}
                  onChange={(e) => setPassportExpiry(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meal / Dietary Preference
                </label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                >
                  {DIETARY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Travel Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Wheelchair, Aisle seat preference"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Sub-Account Provisioning (Only on Create) */}
          {!editingMember && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Enable Separate Sub-Account Login
                    </span>
                    <span className="text-[11px] text-slate-600 block leading-relaxed">
                      Creates independent credentials for this member. They will sign in and view{" "}
                      <strong>only their own bookings</strong>, while you retain full oversight as Family Administrator.
                    </span>
                  </div>
                </label>

                {createAccount && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Initial Password *
                      </label>
                      <input
                        type="password"
                        required={createAccount}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required={createAccount}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-105 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingMember ? "Save Changes" : "Add to Family"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
