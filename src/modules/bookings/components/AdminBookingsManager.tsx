"use client";

import { useState } from "react";
import { Booking } from "../domain/booking.entity";
import { Calendar, Phone, Mail, Trash2, CheckCircle, Clock } from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";

interface AdminBookingsManagerProps {
  initialBookings: Booking[];
}

export default function AdminBookingsManager({ initialBookings }: AdminBookingsManagerProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const reloadBookings = async () => {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
  };

  const handleStatusChange = async (id: string, status: Booking["status"]) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await reloadBookings();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete booking inquiry from ${name}?`)) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete booking");
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Tour Booking Inquiries
        </h1>
        <p className="text-xs text-slate-500">
          Manage incoming holiday leads, contact travelers, and update status.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No booking inquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Tour Package</th>
                  <th className="py-4 px-6">Travel Date & People</th>
                  <th className="py-4 px-6">Special Requests</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-slate-900">{b.customer_name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <a href={`tel:${b.customer_phone}`} className="hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          <span>{b.customer_phone}</span>
                        </a>
                      </div>
                      <div className="text-[11px] text-slate-400">{b.customer_email}</div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {b.tour_title || "Custom Package"}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>{b.travel_date}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {b.travelers_count} Travelers
                      </div>
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-slate-600 line-clamp-2">
                        {b.special_requests || "—"}
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border-0 cursor-pointer ${
                          b.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.status === "contacted"
                            ? "bg-blue-100 text-blue-800"
                            : b.status === "cancelled"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${b.customer_phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(b.customer_name)},%20this%20is%20Yellow%20Ribbon%20Travels%20regarding%20your%20holiday%20inquiry.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors"
                          title="Message on WhatsApp"
                        >
                          <WhatsAppIcon className="w-4 h-4 fill-white" />
                        </a>
                        <button
                          onClick={() => handleDelete(b.id, b.customer_name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
