"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import { Printer, Copy, Check, ArrowLeft, Share2, Sparkles } from "lucide-react";

interface ItineraryActionButtonsProps {
  itineraryId: string;
  referenceNo: string;
  clientName: string;
  clientPhone: string;
  destination: string;
  amount: number;
}

export default function ItineraryActionButtons({
  itineraryId,
  referenceNo,
  clientName,
  clientPhone,
  destination,
  amount,
}: ItineraryActionButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("print") === "1" || params.has("print")) {
        const timer = setTimeout(() => {
          window.print();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    const base = origin || (typeof window !== "undefined" ? window.location.origin : "");
    const url = `${base}/itinerary/${itineraryId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const itnUrl = `${origin}/itinerary/${itineraryId}`;
  const waMessage = `Dear ${clientName},\n\nWe have prepared your personalized holiday itinerary (${referenceNo}) for ${destination}!\n\nView or download your complete itinerary and luxury inclusions here:\n${itnUrl}\n\nPlease let us know if you would like any customizations.\n\nWarm regards,\nYellow Ribbon Travels Team`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-sm">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Yellow Ribbon Travels</span>
      </Link>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied Link!" : "Copy Link"}</span>
        </button>

        {/* WhatsApp Share */}
        <a
          href={`https://wa.me/${clientPhone}?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors shadow-xs"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
          <span>Share on WhatsApp with Client</span>
        </a>

        {/* Print / Download PDF */}
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-amber-400" />
          <span>Print / Save as PDF</span>
        </button>
      </div>
    </div>
  );
}
