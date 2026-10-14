"use client";

import { useState } from "react";
import { SupportTicket } from "../domain/ticket.entity";
import {
  LifeBuoy,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Edit2,
  Save,
  X,
} from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";

interface AdminTicketsManagerProps {
  initialTickets: SupportTicket[];
}

export default function AdminTicketsManager({ initialTickets }: AdminTicketsManagerProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");
  const [editStatus, setEditStatus] = useState<SupportTicket["status"]>("open");
  const [saving, setSaving] = useState(false);

  const filteredTickets =
    statusFilter === "all"
      ? tickets
      : tickets.filter((t) => t.status === statusFilter);

  const startEditing = (t: SupportTicket) => {
    setEditingTicketId(t.id);
    setEditNotes(t.admin_notes || "");
    setEditStatus(t.status);
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          admin_notes: editNotes,
        }),
      });

      if (!res.ok) throw new Error("Failed to update ticket");
      const result = await res.json();

      setTickets((prev) =>
        prev.map((t) => (t.id === id ? result.ticket : t))
      );
      setEditingTicketId(null);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Client Support Tickets & Requests
          </h1>
          <p className="text-xs text-slate-500">
            Manage inquiries, ticket status, and post official concierge responses.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {["all", "open", "in_progress", "resolved", "closed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                statusFilter === st
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No support tickets found matching this filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTickets.map((t) => {
              const isEditing = editingTicketId === t.id;
              const phoneClean = t.customer_phone.replace(/[^0-9]/g, "");

              return (
                <div key={t.id} className="p-5 sm:p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                        {t.ticket_number}
                      </span>
                      <h3 className="font-black text-base text-slate-900">{t.subject}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {t.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          t.priority === "urgent"
                            ? "bg-rose-100 text-rose-800"
                            : t.priority === "high"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {t.priority}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          t.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.status === "in_progress"
                            ? "bg-cyan-100 text-cyan-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="font-bold text-slate-900">{t.customer_name}</span>
                    <span>•</span>
                    <a href={`mailto:${t.customer_email}`} className="text-amber-600 hover:underline flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{t.customer_email}</span>
                    </a>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.customer_phone}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">
                      {new Date(t.created_at).toLocaleDateString()} at {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Body */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800 leading-relaxed font-normal">
                    {t.message}
                  </div>

                  {/* Concierge Response Notes */}
                  {isEditing ? (
                    <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-indigo-900">
                          Edit Concierge Response & Status
                        </label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as SupportTicket["status"])}
                          className="px-3 py-1 rounded-lg text-xs font-bold border border-indigo-200 bg-white"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      <textarea
                        rows={3}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Write official response visible to the client in their portal..."
                        className="w-full p-2.5 rounded-xl border border-indigo-200 text-xs focus:ring-2 focus:ring-indigo-400 bg-white"
                      />

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingTicketId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleSave(t.id)}
                          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{saving ? "Saving..." : "Save Response"}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    t.admin_notes && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Concierge Response:</strong> {t.admin_notes}
                          </div>
                        </div>
                        <button
                          onClick={() => startEditing(t)}
                          className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold flex items-center gap-1 shrink-0"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    )
                  )}

                  {/* Action Bar */}
                  {!isEditing && (
                    <div className="flex items-center justify-end gap-2.5 pt-1">
                      <a
                        href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                          `Hi ${t.customer_name}, this is Yellow Ribbon Travels Concierge regarding your support ticket ${t.ticket_number} (${t.subject}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                        <span>Reply on WhatsApp</span>
                      </a>

                      {!t.admin_notes && (
                        <button
                          onClick={() => startEditing(t)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Add Concierge Response</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
