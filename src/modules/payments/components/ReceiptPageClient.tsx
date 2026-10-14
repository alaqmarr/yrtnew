"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Printer, ArrowLeft, Share2, Check, Copy } from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import OfficialPaymentReceiptDocument from "./OfficialPaymentReceiptDocument";
import { ReceiptData } from "./PaymentReceiptModal";

interface ReceiptPageClientProps {
  data: ReceiptData;
  autoPrint?: boolean;
}

export default function ReceiptPageClient({
  data,
  autoPrint = false,
}: ReceiptPageClientProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = `Official Yellow Ribbon Travels Tax Receipt & Payment Voucher for ${data.customerName} (Ref: ${data.linkCode}, ₹${data.amount.toLocaleString("en-IN")}): ${currentUrl}`;

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col print:bg-white print:min-h-0">
      {/* 1. TOP FLOATING ACTION BAR (Hidden on Print) */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 text-white backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl print:hidden shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/pay/${data.linkCode}`}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Payment Overview"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="font-bold text-sm tracking-tight block">
              Official Tax Receipt & Payment Voucher
            </span>
            <span className="text-[11px] text-slate-400">
              Receipt No: <code className="font-mono text-amber-400">YRT-REC-{data.linkCode}</code> • {data.customerName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all border border-slate-700 cursor-pointer"
            title="Copy Receipt URL to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Share on WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 transition-all border border-emerald-800/80 cursor-pointer"
            title="Share receipt on WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          {/* Print / Save PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </header>

      {/* 2. RECEIPT DOCUMENT VIEWPORT */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 flex justify-center items-start print:p-0 print:m-0">
        <OfficialPaymentReceiptDocument data={data} />
      </main>
    </div>
  );
}
