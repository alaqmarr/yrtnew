"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import { Printer, Copy, Check, ArrowLeft } from "lucide-react";

interface InvoiceActionButtonsProps {
  invoiceId: string;
  invoiceNumber: string;
  type: string;
  clientName: string;
  clientPhone: string;
  totalAmount: number;
}

export default function InvoiceActionButtons({
  invoiceId,
  invoiceNumber,
  type,
  clientName,
  clientPhone,
  totalAmount,
}: InvoiceActionButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    const base = origin || (typeof window !== "undefined" ? window.location.origin : "");
    const url = `${base}/invoice/${invoiceId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const invoiceUrl = `${origin}/invoice/${invoiceId}`;
  const waMessage = `Dear ${clientName},\n\nPlease find your official Yellow Ribbon Travels ${type} (${invoiceNumber}) for ₹${totalAmount.toLocaleString(
    "en-IN"
  )}.\n\nView or download your digital PDF document here:\n${invoiceUrl}\n\nThank you for choosing Yellow Ribbon Travels!`;

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
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied Link!" : "Copy Link"}</span>
        </button>

        <a
          href={`https://wa.me/${clientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors shadow-xs"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
          <span>Share on WhatsApp with Client</span>
        </a>

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
