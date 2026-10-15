"use client";

import { useState } from "react";
import { SiteSettingsMap } from "../domain/site-setting.entity";
import {
  Save,
  CheckCircle,
  Phone,
  Sparkles,
  Star,
  Cloud,
  Mail,
  Send,
  Lock,
  Server,
  ShieldCheck,
  CreditCard,
  FlaskConical,
  ExternalLink,
  Key,
  Plane,
  BarChart3,
  Search,
  Globe,
} from "lucide-react";

interface AdminSettingsManagerProps {
  initialSettings: SiteSettingsMap;
}

export default function AdminSettingsManager({ initialSettings }: AdminSettingsManagerProps) {
  const [settings, setSettings] = useState<SiteSettingsMap>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Test Email state
  const [testEmailTarget, setTestEmailTarget] = useState("");
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload: Record<string, { value: string; group?: string }> = {};
      for (const [k, v] of Object.entries(settings)) {
        payload[k] = { value: v };
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      const updated = await res.json();
      setSettings(updated);
      setSuccess("All settings (including Razorpay live & test credentials, R2, and SMTP) successfully saved to database!");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailTarget) {
      alert("Please enter a destination email address to send the test email.");
      return;
    }
    setTestingEmail(true);
    setTestEmailResult(null);

    try {
      const res = await fetch("/api/settings/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: testEmailTarget }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTestEmailResult({ success: false, message: data.error || "Failed to send test email" });
      } else {
        setTestEmailResult({ success: true, message: data.message });
      }
    } catch (err) {
      setTestEmailResult({ success: false, message: (err as Error).message });
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Global CMS & Infrastructure Settings
        </h1>
        <p className="text-xs text-slate-500">
          Control contact information, social proof, Cloudflare R2 storage credentials, and Gmail/Nodemailer SMTP directly from the database.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-xs bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Company Contact Lines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Phone / Flight Desk
              </label>
              <input
                type="text"
                value={settings.phone_primary || ""}
                onChange={(e) => handleChange("phone_primary", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Helpline Number
              </label>
              <input
                type="text"
                value={settings.whatsapp_number || ""}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Email Address
            </label>
            <input
              type="email"
              value={settings.email_primary || ""}
              onChange={(e) => handleChange("email_primary", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Head Office Physical Address (Secunderabad)
            </label>
            <textarea
              rows={2}
              value={settings.head_office_address || ""}
              onChange={(e) => handleChange("head_office_address", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Razorpay Payment Gateway (Database Controlled: Live & Test) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Razorpay Payment Gateway (Live & Test Credentials)
                </h3>
                <p className="text-xs text-slate-500">
                  Store production and sandbox API keys directly in the database.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                  settings.razorpay_mode === "live"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                {settings.razorpay_mode === "live" ? "● Live Gateway Active" : "🧪 Test Mode Active"}
              </span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Default Gateway Environment for Public Routes (/pay, /tours, etc.)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  settings.razorpay_mode !== "live"
                    ? "bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                    : "bg-white/60 border-slate-200 hover:bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="razorpay_mode"
                  value="test"
                  checked={settings.razorpay_mode !== "live"}
                  onChange={() => handleChange("razorpay_mode", "test")}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    🧪 Test / Sandbox Mode (Safe)
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">
                    Uses Test Keys. Allows testing checkout flows without charging real bank accounts.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  settings.razorpay_mode === "live"
                    ? "bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                    : "bg-white/60 border-slate-200 hover:bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="razorpay_mode"
                  value="live"
                  checked={settings.razorpay_mode === "live"}
                  onChange={() => handleChange("razorpay_mode", "live")}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    🟢 Live Production Mode
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">
                    Uses Live Keys. Charges real money from customers for confirmed tour bookings.
                  </span>
                </div>
              </label>
            </div>

            <div className="p-2.5 rounded-xl bg-cyan-50/80 border border-cyan-200/60 text-[11px] text-cyan-900 flex items-center justify-between gap-2 mt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <FlaskConical className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                <span>
                  <strong>Dedicated QA Sandbox:</strong> All routes under <code className="font-bold bg-white px-1 py-0.5 rounded text-cyan-950">/beta</code> (like <code className="font-bold bg-white px-1 py-0.5 rounded text-cyan-950">/beta/pay</code>) ALWAYS enforce Test credentials regardless of the mode above!
                </span>
              </span>
              <a
                href="/beta/pay"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-cyan-800 hover:text-cyan-950 font-bold underline flex items-center gap-1"
              >
                <span>Open /beta/pay</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Test Keys (Sandbox) */}
          <div className="p-4 sm:p-5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                <span>Test / Sandbox Credentials (Used by /beta/pay)</span>
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Safe for Testing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Razorpay Key ID (Test)
                </label>
                <input
                  type="text"
                  placeholder="rzp_test_..."
                  value={settings.razorpay_key_id_test || ""}
                  onChange={(e) => handleChange("razorpay_key_id_test", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Razorpay Key Secret (Test)
                </label>
                <input
                  type="password"
                  placeholder="Razorpay Test Secret"
                  value={settings.razorpay_key_secret_test || ""}
                  onChange={(e) => handleChange("razorpay_key_secret_test", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Live Keys (Production) */}
          <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Key className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Production Credentials (Real Customer Payments)</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Real Transactions
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Razorpay Key ID (Live)
                </label>
                <input
                  type="text"
                  placeholder="rzp_live_..."
                  value={settings.razorpay_key_id_live || ""}
                  onChange={(e) => handleChange("razorpay_key_id_live", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Razorpay Key Secret (Live)
                </label>
                <input
                  type="password"
                  placeholder="Razorpay Live Secret"
                  value={settings.razorpay_key_secret_live || ""}
                  onChange={(e) => handleChange("razorpay_key_secret_live", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Currency & Gateway Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Currency Code
              </label>
              <select
                value={settings.razorpay_currency || "INR"}
                onChange={(e) => handleChange("razorpay_currency", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="AED">AED (د.إ - UAE Dirham)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="razorpay_enabled_check"
                checked={settings.razorpay_enabled !== "false"}
                onChange={(e) => handleChange("razorpay_enabled", e.target.checked ? "true" : "false")}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <label htmlFor="razorpay_enabled_check" className="text-xs font-semibold text-slate-700">
                Enable Razorpay Checkout Gateway on Site
              </label>
            </div>
          </div>
        </div>

        {/* Cloudflare R2 Credentials in Database */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-cyan-600" />
              <span>Cloudflare R2 Object Storage (Database Controlled)</span>
            </h3>
            <span className="text-[10px] bg-cyan-50 text-cyan-700 font-bold px-2 py-0.5 rounded-full border border-cyan-200">
              Live Storage
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Configure Cloudflare R2 S3-compatible credentials stored in SQLite. If left empty, image uploads gracefully fall back to local disk storage in <code className="bg-slate-100 px-1 rounded">/public/uploads/</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                R2 Account ID
              </label>
              <input
                type="text"
                placeholder="e.g. 7c32bf90e8a7..."
                value={settings.r2_account_id || ""}
                onChange={(e) => handleChange("r2_account_id", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                R2 Bucket Name
              </label>
              <input
                type="text"
                placeholder="e.g. yrt-travel-gallery"
                value={settings.r2_bucket_name || ""}
                onChange={(e) => handleChange("r2_bucket_name", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                R2 Access Key ID
              </label>
              <input
                type="text"
                placeholder="Access Key ID"
                value={settings.r2_access_key_id || ""}
                onChange={(e) => handleChange("r2_access_key_id", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                R2 Secret Access Key
              </label>
              <input
                type="password"
                placeholder="Secret Access Key"
                value={settings.r2_secret_access_key || ""}
                onChange={(e) => handleChange("r2_secret_access_key", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Public CDN / R2 Custom Domain URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://media.yellowribbontravels.com or pub-xyz.r2.dev"
              value={settings.r2_public_url || ""}
              onChange={(e) => handleChange("r2_public_url", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Nodemailer + Gmail SMTP in Database */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-500" />
              <span>Nodemailer & Gmail SMTP Server (Database Controlled)</span>
            </h3>
            <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
              Email Notifications
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Store your Gmail or SMTP host details in SQLite to send booking confirmations, flight lead notifications, and contact queries.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SMTP Host
              </label>
              <input
                type="text"
                placeholder="smtp.gmail.com"
                value={settings.smtp_host || "smtp.gmail.com"}
                onChange={(e) => handleChange("smtp_host", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SMTP Port
              </label>
              <input
                type="number"
                placeholder="465"
                value={settings.smtp_port || "465"}
                onChange={(e) => handleChange("smtp_port", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="smtp_secure_check"
                checked={settings.smtp_secure !== "false"}
                onChange={(e) => handleChange("smtp_secure", e.target.checked ? "true" : "false")}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <label htmlFor="smtp_secure_check" className="text-xs font-semibold text-slate-700">
                SSL / TLS Secure
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gmail / SMTP Username (Email)
              </label>
              <input
                type="email"
                placeholder="yellowribbontravels@gmail.com"
                value={settings.smtp_user || ""}
                onChange={(e) => handleChange("smtp_user", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gmail App Password / SMTP Password
              </label>
              <input
                type="password"
                placeholder="16-character Gmail App Password"
                value={settings.smtp_pass || ""}
                onChange={(e) => handleChange("smtp_pass", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sender Name
              </label>
              <input
                type="text"
                placeholder="Yellow Ribbon Travels"
                value={settings.smtp_from_name || "Yellow Ribbon Travels"}
                onChange={(e) => handleChange("smtp_from_name", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sender Email
              </label>
              <input
                type="email"
                placeholder="yellowribbontravels@gmail.com"
                value={settings.smtp_from_email || ""}
                onChange={(e) => handleChange("smtp_from_email", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Test Email Section */}
          <div className="pt-4 mt-2 border-t border-slate-100 bg-slate-50 p-4 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-rose-500" />
              <span>Verify & Send Test Email</span>
            </span>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Recipient email address for test..."
                value={testEmailTarget}
                onChange={(e) => setTestEmailTarget(e.target.value)}
                className="flex-grow px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={testingEmail}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50 shrink-0"
              >
                {testingEmail ? "Dispatching..." : "Send Test"}
              </button>
            </div>

            {testEmailResult && (
              <div
                className={`p-2.5 rounded-xl text-xs ${
                  testEmailResult.success
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {testEmailResult.message}
              </div>
            )}
          </div>
        </div>

        {/* Hero Background Videos (Up to 5 Videos) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Hero Background Videos (Up to 5 Videos)</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                handleChange(
                  "hero_video_1",
                  "https://videos.pexels.com/video-files/31733343/13520588_1920_1080_30fps.mp4"
                );
                handleChange(
                  "hero_video_2",
                  "https://videos.pexels.com/video-files/4010511/4010511-hd_1920_1080_25fps.mp4"
                );
                handleChange(
                  "hero_video_3",
                  "https://videos.pexels.com/video-files/4010941/4010941-uhd_2560_1440_25fps.mp4"
                );
                handleChange(
                  "hero_video_4",
                  "https://videos.pexels.com/video-files/37999130/16126233_2560_1440_30fps.mp4"
                );
                handleChange(
                  "hero_video_5",
                  "https://videos.pexels.com/video-files/29045884/12556561_2560_1440_60fps.mp4"
                );
              }}
              className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-full transition-colors self-start sm:self-auto"
            >
              Load Default 5 Pexels Videos
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Configure up to 5 direct MP4 video URLs for the homepage Hero background. Videos automatically crossfade into the next clip when finished, and visitors can also switch between them via the bottom indicator pills. Leave all blank to use the 5 built-in Pexels videos.
          </p>

          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3, 4, 5].map((num) => {
              const key = `hero_video_${num}`;
              const placeholder =
                num === 1
                  ? "https://videos.pexels.com/video-files/31733343/13520588_1920_1080_30fps.mp4"
                  : num === 2
                  ? "https://videos.pexels.com/video-files/4010511/4010511-hd_1920_1080_25fps.mp4"
                  : num === 3
                  ? "https://videos.pexels.com/video-files/4010941/4010941-uhd_2560_1440_25fps.mp4"
                  : num === 4
                  ? "https://videos.pexels.com/video-files/37999130/16126233_2560_1440_30fps.mp4"
                  : "https://videos.pexels.com/video-files/29045884/12556561_2560_1440_60fps.mp4";
              return (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hero Video #{num} (Default Active)
                  </label>
                  <input
                    type="url"
                    placeholder={placeholder}
                    value={settings[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Announcement Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Top Announcement Banner</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Banner Text
            </label>
            <input
              type="text"
              value={settings.announcement_banner_text || ""}
              onChange={(e) => handleChange("announcement_banner_text", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="banner_toggle"
              checked={settings.announcement_banner_active === "true"}
              onChange={(e) =>
                handleChange("announcement_banner_active", e.target.checked ? "true" : "false")
              }
              className="w-4 h-4 text-amber-600 rounded"
            />
            <label htmlFor="banner_toggle" className="text-xs font-semibold text-slate-700">
              Show announcement banner at the very top of public site
            </label>
          </div>
        </div>

        {/* Flight Bookings Session Popup */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Plane className="w-4 h-4 text-cyan-600 rotate-45" />
              <span>Flight Booking Modal Popup (Per Session)</span>
            </h3>
            <span className="text-[10px] bg-cyan-50 text-cyan-700 font-bold px-2.5 py-0.5 rounded-full border border-cyan-200">
              User Acquisition & Lead Gen
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Intuitively displays a quick flight inquiry popup when a user visits the site. Stored in <code className="bg-slate-100 px-1 rounded font-mono">sessionStorage</code> so it displays once per active browsing session, without being intrusive on every page navigation.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="flight_popup_toggle"
              checked={settings.flight_popup_enabled !== "false"}
              onChange={(e) =>
                handleChange("flight_popup_enabled", e.target.checked ? "true" : "false")
              }
              className="w-4 h-4 text-amber-600 rounded"
            />
            <label htmlFor="flight_popup_toggle" className="text-xs font-semibold text-slate-800">
              Enable Flight Booking Popup for new sessions
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Popup Title / Headline
              </label>
              <input
                type="text"
                value={settings.flight_popup_heading || ""}
                placeholder="e.g. Planning Your Next Flight?"
                onChange={(e) => handleChange("flight_popup_heading", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Delay (Seconds)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="30"
                value={settings.flight_popup_delay_sec || "2.5"}
                onChange={(e) => handleChange("flight_popup_delay_sec", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subheadline / Description
            </label>
            <input
              type="text"
              value={settings.flight_popup_subheading || ""}
              placeholder="e.g. Exclusive domestic & international fares with instant WhatsApp quotations from our IATA Flight Desk."
              onChange={(e) => handleChange("flight_popup_subheading", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Social Proof & Metrics */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>Social Proof & Counters</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Rating Score
              </label>
              <input
                type="text"
                value={settings.google_rating || "4.9"}
                onChange={(e) => handleChange("google_rating", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Reviews
              </label>
              <input
                type="text"
                value={settings.total_reviews_count || "480+"}
                onChange={(e) => handleChange("total_reviews_count", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Happy Travelers
              </label>
              <input
                type="text"
                value={settings.happy_travelers_count || "15,000+"}
                onChange={(e) => handleChange("happy_travelers_count", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destinations Count
              </label>
              <input
                type="text"
                value={settings.destinations_count || "50+"}
                onChange={(e) => handleChange("destinations_count", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* SEO, Google Analytics & Search Console Verification */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>SEO, Google Analytics & Search Console (Database Controlled)</span>
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Webmaster & Traffic
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Configure your Google Analytics GA4 Measurement ID and Webmaster verification tokens. These update live on the site and inject proper tracking and meta verification tags.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Analytics 4 Measurement ID
              </label>
              <input
                type="text"
                placeholder="e.g. G-XXXXXXXXXX"
                value={settings.google_analytics_id || ""}
                onChange={(e) => handleChange("google_analytics_id", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Found under Google Analytics &gt; Admin &gt; Data Streams
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Search Console Verification Token
              </label>
              <input
                type="text"
                placeholder="e.g. google-site-verification token or code"
                value={settings.google_site_verification || ""}
                onChange={(e) => handleChange("google_site_verification", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Content value for &lt;meta name=&quot;google-site-verification&quot; /&gt;
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bing Webmaster Verification Code (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Bing Webmaster Authentication Meta Tag"
              value={settings.bing_site_verification || ""}
              onChange={(e) => handleChange("bing_site_verification", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl flex items-center justify-between gap-4 mt-8">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Database Settings · Live changes apply across the entire portal
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving Settings..." : "Save & Publish All Database Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
