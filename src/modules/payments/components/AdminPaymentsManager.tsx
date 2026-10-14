"use client";

import { useState, useEffect } from "react";
import { PaymentLink } from "../domain/payment-link.entity";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import {
  Plus,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Search,
  DollarSign,
  ShieldCheck,
  Clock,
  CheckCircle2,
  X,
  CreditCard,
  Send,
  Printer,
} from "lucide-react";
import PaymentReceiptModal, { ReceiptData } from "./PaymentReceiptModal";
import CustomerLookupInput from "@/modules/contacts/components/CustomerLookupInput";

interface AdminPaymentsManagerProps {
  initialLinks: PaymentLink[];
}

export default function AdminPaymentsManager({ initialLinks }: AdminPaymentsManagerProps) {
  const [links, setLinks] = useState<PaymentLink[]>(initialLinks);
  const [filter, setFilter] = useState<"all" | "pending" | "paid">("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeReceiptData, setActiveReceiptData] = useState<ReceiptData | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "+91 ",
    customer_email: "",
    amount: 15000,
    currency: "INR",
    purpose: "",
    description: "",
  });

  const reloadLinks = async () => {
    try {
      const res = await fetch("/api/payments/links");
      const data = await res.json();
      if (Array.isArray(data)) setLinks(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = (code: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/pay/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete payment link "${code}"?`)) return;
    try {
      const res = await fetch(`/api/payments/links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete link");
      setLinks(links.filter((l) => l.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create payment link");

      await reloadLinks();
      setIsModalOpen(false);
      setFormData({
        customer_name: "",
        customer_phone: "+91 ",
        customer_email: "",
        amount: 15000,
        currency: "INR",
        purpose: "",
        description: "",
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLinks = links
    .filter((l) => {
      if (filter === "pending") return l.status === "pending";
      if (filter === "paid") return l.status === "paid";
      return true;
    })
    .filter((l) => {
      const q = search.toLowerCase();
      return (
        l.customer_name.toLowerCase().includes(q) ||
        l.customer_phone.toLowerCase().includes(q) ||
        l.link_code.toLowerCase().includes(q) ||
        l.purpose.toLowerCase().includes(q)
      );
    });

  const totalCollected = links
    .filter((l) => l.status === "paid")
    .reduce((sum, l) => sum + l.amount, 0);

  const pendingAmount = links
    .filter((l) => l.status === "pending")
    .reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Razorpay Payment Links Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Set custom amounts, generate secure links, and dispatch instantly to clients on WhatsApp.
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Payment Link</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Paid Collections
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            ₹{totalCollected.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-500">
            {links.filter((l) => l.status === "paid").length} completed transactions
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pending Links Volume
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            ₹{pendingAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-500">
            {links.filter((l) => l.status === "pending").length} active customer links
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Gateway Status
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-600 flex items-center gap-2">
            <span>Razorpay</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-[11px] text-slate-500">Live SSL 256-Bit Protection</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All ({links.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "pending" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Pending ({links.filter((l) => l.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("paid")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "paid" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Paid ({links.filter((l) => l.status === "paid").length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, phone, or code..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>

      {/* Table of Links */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Link Code</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Purpose</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLinks.map((l) => {
                const payUrl = `${origin}/pay/${l.link_code}`;
                const waMessage = `Hi ${l.customer_name}, please find your official Yellow Ribbon Travels payment link for ₹${l.amount.toLocaleString(
                  "en-IN"
                )} (${l.purpose}):\n\n${payUrl}\n\nPay securely using UPI, Cards or NetBanking. Thank you!`;
                const cleanPhone = l.customer_phone.replace(/[^0-9]/g, "");

                return (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-slate-900">{l.link_code}</div>
                      <div className="text-[11px] text-slate-400" suppressHydrationWarning>
                        {new Date(l.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{l.customer_name}</div>
                      <div className="text-[11px] text-slate-500">{l.customer_phone}</div>
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-semibold text-slate-800 line-clamp-1">{l.purpose}</div>
                      {l.description && (
                        <div className="text-[11px] text-slate-400 line-clamp-1">{l.description}</div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-sm font-black text-slate-900">
                        ₹{l.amount.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-slate-400">{l.currency}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          l.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {l.status === "paid" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {l.status}
                      </span>
                      {l.paid_at && (
                        <div className="text-[10px] text-slate-400 mt-0.5" suppressHydrationWarning>
                          {new Date(l.paid_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Copy Link Button */}
                        <button
                          onClick={() => handleCopyLink(l.link_code)}
                          className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Copy Payment Link URL"
                        >
                          {copiedCode === l.link_code ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* WhatsApp Share Button */}
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Share on WhatsApp with Client"
                        >
                          <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                        </a>

                        {/* Open Link */}
                        <a
                          href={`/pay/${l.link_code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                          title="Preview Payment Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Print / View Official Tax Receipt */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReceiptData({
                              linkCode: l.link_code,
                              customerName: l.customer_name,
                              customerPhone: l.customer_phone,
                              customerEmail: l.customer_email || undefined,
                              purpose: l.purpose,
                              description: l.description,
                              amount: l.amount,
                              currency: l.currency,
                              status: l.status,
                              paymentId: l.razorpay_payment_id,
                              paidAt: l.paid_at,
                              createdAt: l.created_at,
                            });
                          }}
                          className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="View & Print Official Tax Receipt"
                        >
                          <Printer className="w-4 h-4 text-amber-500" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(l.id, l.link_code)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredLinks.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No payment links found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 px-6 bg-slate-900 text-white flex items-center justify-between shrink-0 rounded-t-3xl">
              <div>
                <h3 className="text-lg font-bold">Generate Client Payment Link</h3>
                <p className="text-xs text-slate-400">Creates a secure Razorpay checkout URL</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl border border-rose-100">
                    {error}
                  </div>
                )}

              <CustomerLookupInput
                name={formData.customer_name}
                phone={formData.customer_phone}
                email={formData.customer_email}
                onNameChange={(val) => setFormData((prev) => ({ ...prev, customer_name: val }))}
                onPhoneChange={(val) => setFormData((prev) => ({ ...prev, customer_phone: val }))}
                onEmailChange={(val) => setFormData((prev) => ({ ...prev, customer_email: val }))}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Amount (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.amount || ""}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/20"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Purpose / Item *
                </label>
                <input
                  type="text"
                  required
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g. Kashmir 6D5N Tour Package Advance Deposit"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Notes / Inclusions Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Includes Dal Lake Houseboat stay, Gulmarg Gondola tickets, and private Innova transfers."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-end gap-3 shrink-0 rounded-b-3xl shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Generating Link..." : "Generate Payment Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

      {/* Official Tax Receipt Modal Preview */}
      {activeReceiptData && (
        <PaymentReceiptModal
          isOpen={!!activeReceiptData}
          onClose={() => setActiveReceiptData(null)}
          data={activeReceiptData}
        />
      )}
    </div>
  );
}
