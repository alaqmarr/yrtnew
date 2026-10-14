"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Printer, X, ExternalLink } from "lucide-react";
import OfficialPaymentReceiptDocument from "./OfficialPaymentReceiptDocument";

export interface ReceiptData {
  linkCode: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  purpose: string;
  description?: string | null;
  amount: number;
  currency?: string;
  status: string;
  paymentId?: string | null;
  paidAt?: string | null;
  createdAt?: string;
}

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReceiptData;
}

export default function PaymentReceiptModal({
  isOpen,
  onClose,
  data,
}: PaymentReceiptModalProps) {
  // Prevent body scroll when modal is open and handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto">
      {/* 1. TOP FLOATING ACTION BAR (Hidden in Print) */}
      <div className="sticky top-0 z-50 w-full bg-slate-900/95 border-b border-slate-800 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl print:hidden shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
            PDF
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block">
              Official Tax Receipt & Payment Voucher
            </span>
            <span className="text-[11px] text-slate-400">
              Ref: <code className="font-mono text-amber-400">{data.linkCode}</code> • Standard A4 Printable Letterhead
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/receipt/${data.linkCode}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all border border-slate-700 cursor-pointer"
            title="Open dedicated receipt page in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Direct Link</span>
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            title="Open browser print dialog or Save as PDF"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Preview (Escape)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. DOCUMENT VIEWPORT AREA */}
      <div className="flex-1 p-4 sm:p-8 lg:p-12 flex justify-center items-start print:p-0">
        <OfficialPaymentReceiptDocument data={data} />
      </div>
    </div>
  );
}
