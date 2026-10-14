"use client";

import { useState } from "react";
import { FlightInquiry } from "../domain/flight-inquiry.entity";
import { Plane, Calendar, Phone, Mail, Trash2, ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";

interface AdminFlightsManagerProps {
  initialInquiries: FlightInquiry[];
}

export default function AdminFlightsManager({ initialInquiries }: AdminFlightsManagerProps) {
  const [inquiries, setInquiries] = useState<FlightInquiry[]>(initialInquiries);

  const reloadInquiries = async () => {
    const res = await fetch("/api/flights");
    const data = await res.json();
    setInquiries(data);
  };

  const handleStatusChange = async (id: string, status: FlightInquiry["status"]) => {
    try {
      const res = await fetch(`/api/flights/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await reloadInquiries();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete flight inquiry from ${name}?`)) return;

    try {
      const res = await fetch(`/api/flights/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete flight inquiry");
      setInquiries(inquiries.filter((f) => f.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Flight Booking Leads & Inquiries
        </h1>
        <p className="text-xs text-slate-500">
          Direct airline ticketing inquiries received from travelers across India.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No flight inquiries received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Route</th>
                  <th className="py-4 px-6">Travel Dates</th>
                  <th className="py-4 px-6">Passengers & Cabin</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-slate-900">{f.customer_name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-500" />
                        <span>{f.customer_phone}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{f.customer_email}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{f.from_city}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{f.to_city}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {f.trip_type}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>{f.depart_date}</span>
                      </div>
                      {f.return_date && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Return: {f.return_date}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{f.cabin_class}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {f.passengers_adults} Adults
                        {f.passengers_children > 0 && `, ${f.passengers_children} Children`}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={f.status}
                        onChange={(e) => handleStatusChange(f.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border-0 cursor-pointer ${
                          f.status === "booked"
                            ? "bg-emerald-100 text-emerald-800"
                            : f.status === "quoted"
                            ? "bg-purple-100 text-purple-800"
                            : f.status === "contacted"
                            ? "bg-blue-100 text-blue-800"
                            : f.status === "cancelled"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="booked">Booked</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${f.customer_phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(f.customer_name)},%20this%20is%20Yellow%20Ribbon%20Travels%20regarding%20your%20flight%20quote%20for%20${encodeURIComponent(f.from_city)}%20to%20${encodeURIComponent(f.to_city)}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors"
                          title="Message on WhatsApp"
                        >
                          <WhatsAppIcon className="w-4 h-4 fill-white" />
                        </a>
                        <button
                          onClick={() => handleDelete(f.id, f.customer_name)}
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
