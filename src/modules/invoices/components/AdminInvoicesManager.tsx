"use client";

import { useState, useEffect } from "react";
import { Invoice, InvoiceItem } from "../domain/invoice.entity";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import CustomerLookupInput from "@/modules/contacts/components/CustomerLookupInput";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Printer,
  Receipt,
  FileText,
  Search,
  CheckCircle2,
  PlusCircle,
  MinusCircle,
  X,
  CreditCard,
} from "lucide-react";

interface AdminInvoicesManagerProps {
  initialInvoices: Invoice[];
}

export default function AdminInvoicesManager({
  initialInvoices,
}: AdminInvoicesManagerProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [filter, setFilter] = useState<"all" | "Invoice" | "Quote" | "Paid" | "Sent" | "Draft">("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const [formData, setFormData] = useState({
    type: "Invoice" as Invoice["type"],
    client_name: "",
    client_phone: "+91 ",
    client_email: "",
    client_address: "",
    due_date: "",
    status: "Sent" as Invoice["status"],
    tax_percent: 5,
    discount_amount: 0,
    notes: "",
    terms:
      "Payment is due within 7 days. All bookings are subject to Yellow Ribbon Travels standard terms. GSTIN: 36AAECY9102K1Z5.",
    items: [
      {
        description: "Holiday Package (2 Pax, 6 Days / 5 Nights)",
        quantity: 2,
        rate: 35000,
        amount: 70000,
      },
    ] as InvoiceItem[],
  });

  const reloadInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (Array.isArray(data)) setInvoices(data);
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateModal = (type: "Invoice" | "Quote" = "Invoice") => {
    setEditingId(null);
    setFormData({
      type,
      client_name: "",
      client_phone: "+91 ",
      client_email: "",
      client_address: "",
      due_date: "",
      status: type === "Quote" ? "Draft" : "Sent",
      tax_percent: 5,
      discount_amount: 0,
      notes: "",
      terms:
        type === "Quote"
          ? "Quote valid for 10 days from issuance. Subject to airline tariff changes."
          : "Payment is due within 7 days. GSTIN: 36AAECY9102K1Z5.",
      items: [
        {
          description: type === "Quote" ? "Custom Tour Package Proposal (2 Adults)" : "Holiday Tour Package (2 Adults)",
          quantity: 2,
          rate: 30000,
          amount: 60000,
        },
      ],
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (inv: Invoice) => {
    setEditingId(inv.id);
    let parsedItems: InvoiceItem[] = [];
    try {
      parsedItems = JSON.parse(inv.items_json || "[]");
    } catch (e) {
      parsedItems = [];
    }

    setFormData({
      type: inv.type,
      client_name: inv.client_name,
      client_phone: inv.client_phone,
      client_email: inv.client_email || "",
      client_address: inv.client_address || "",
      due_date: inv.due_date || "",
      status: inv.status,
      tax_percent: inv.tax_percent,
      discount_amount: inv.discount_amount,
      notes: inv.notes || "",
      terms: inv.terms || "",
      items: parsedItems.length > 0 ? parsedItems : [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: "Flight / Hotel / Visa Assistance",
          quantity: 1,
          rate: 5000,
          amount: 5000,
        },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length <= 1) return;
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...formData.items];
    const item = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "rate") {
      item.amount = Number(item.quantity || 0) * Number(item.rate || 0);
    }
    updated[index] = item;
    setFormData({ ...formData, items: updated });
  };

  const subtotal = formData.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const taxAmount = (subtotal * (Number(formData.tax_percent) || 0)) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - (Number(formData.discount_amount) || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        type: formData.type,
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        client_email: formData.client_email || null,
        client_address: formData.client_address || null,
        items_json: JSON.stringify(formData.items),
        subtotal,
        tax_percent: Number(formData.tax_percent),
        tax_amount: taxAmount,
        discount_amount: Number(formData.discount_amount),
        total_amount: totalAmount,
        currency: "INR",
        status: formData.status,
        due_date: formData.due_date || null,
        notes: formData.notes || null,
        terms: formData.terms || null,
      };

      const url = editingId ? `/api/invoices/${editingId}` : "/api/invoices";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save invoice");
      }

      await reloadInvoices();
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, num: string) => {
    if (!confirm(`Delete ${num}?`)) return;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setInvoices(invoices.filter((inv) => inv.id !== id));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const filtered = invoices
    .filter((inv) => {
      if (filter === "all") return true;
      if (filter === "Invoice" || filter === "Quote") return inv.type === filter;
      return inv.status === filter;
    })
    .filter((inv) => {
      const q = search.toLowerCase();
      return (
        inv.client_name.toLowerCase().includes(q) ||
        inv.invoice_number.toLowerCase().includes(q) ||
        inv.client_phone.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Invoices & Custom Quotes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate formal tax invoices, custom holiday estimates, and dispatch instant payment links on WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => openCreateModal("Quote")}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 transition-all"
          >
            <Plus className="w-4 h-4 text-cyan-600" />
            <span>Create Custom Quote</span>
          </button>

          <button
            onClick={() => openCreateModal("Invoice")}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {(["all", "Invoice", "Quote", "Paid", "Sent", "Draft"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {st === "all" ? "All Documents" : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client or invoice number..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Doc Number</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Client Details</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv) => {
                const cleanPhone = inv.client_phone.replace(/[^0-9]/g, "");
                const invUrl = `${origin}/invoice/${inv.id}`;
                const waMessage = `Dear ${inv.client_name},\n\nPlease find your official Yellow Ribbon Travels ${inv.type} (${inv.invoice_number}) for ₹${inv.total_amount.toLocaleString(
                  "en-IN"
                )}.\n\nView or download your digital PDF document here:\n${invUrl}\n\nThank you for choosing Yellow Ribbon Travels!`;

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-slate-900">{inv.invoice_number}</div>
                      <div className="text-[11px] text-slate-400" suppressHydrationWarning>
                        {new Date(inv.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          inv.type === "Quote"
                            ? "bg-cyan-100 text-cyan-800"
                            : "bg-slate-150 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {inv.type}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{inv.client_name}</div>
                      <div className="text-[11px] text-slate-500">{inv.client_phone}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-black text-slate-900 text-sm">
                        ₹{inv.total_amount.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Subtotal: ₹{inv.subtotal.toLocaleString("en-IN")}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-medium text-slate-600" suppressHydrationWarning>
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-IN") : "Upon Receipt"}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inv.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : inv.status === "Sent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Share */}
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Share on WhatsApp with Client"
                        >
                          <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                        </a>

                        {/* View & Print Link */}
                        <a
                          href={`/invoice/${inv.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                          title="Preview & Print Letterhead PDF"
                        >
                          <Printer className="w-4 h-4" />
                        </a>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(inv)}
                          className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit Document"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(inv.id, inv.invoice_number)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No invoices or quotes found. Create a new document to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Builder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 px-6 bg-slate-900 text-white flex items-center justify-between shrink-0 rounded-t-3xl">
              <div>
                <h3 className="text-lg font-bold">
                  {editingId ? `Edit ${formData.type}` : `Create ${formData.type}`}
                </h3>
                <p className="text-xs text-slate-400">Generate itemized quote or tax invoice</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {error && (
                  <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl border border-rose-100">
                    {error}
                  </div>
                )}

              {/* Type Switcher */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "Invoice" })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    formData.type === "Invoice"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  Official Tax Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "Quote" })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    formData.type === "Quote"
                      ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  Custom Quotation / Estimate
                </button>
              </div>

              {/* Client Info */}
              <div className="space-y-3">
                <CustomerLookupInput
                  name={formData.client_name}
                  phone={formData.client_phone}
                  email={formData.client_email}
                  onNameChange={(val) => setFormData((prev) => ({ ...prev, client_name: val }))}
                  onPhoneChange={(val) => setFormData((prev) => ({ ...prev, client_phone: val }))}
                  onEmailChange={(val) => setFormData((prev) => ({ ...prev, client_email: val }))}
                  onCustomerSelect={(cust) => {
                    if (cust.city && !formData.client_address) {
                      setFormData((prev) => ({ ...prev, client_address: cust.city || prev.client_address }));
                    }
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Billing Address (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.client_address}
                      onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                      placeholder="e.g. B-402, Banjara Hills, Hyderabad"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value as Invoice["status"] })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Paid">Paid</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Line Items */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Itemized Services ({formData.items.length} Items)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-12 sm:col-span-6">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          placeholder="Service description"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          required
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                          placeholder="Qty"
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-center"
                        />
                      </div>

                      <div className="col-span-5 sm:col-span-3">
                        <input
                          type="number"
                          required
                          min={0}
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, "rate", Number(e.target.value))}
                          placeholder="Rate ₹"
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-right"
                        />
                      </div>

                      <div className="col-span-3 sm:col-span-1 text-right">
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Subtotal:</span>
                  <span className="font-bold text-slate-900 text-sm">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 mb-1">GST / Tax (%)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.tax_percent}
                      onChange={(e) => setFormData({ ...formData, tax_percent: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Discount Amount (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.discount_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, discount_amount: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                  <span>Grand Total (INR):</span>
                  <span className="text-xl text-amber-600">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  rows={2}
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Fixed Submit Footer */}
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
                {loading
                  ? "Saving..."
                  : editingId
                  ? `Update ${formData.type}`
                  : `Generate ${formData.type}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
}
