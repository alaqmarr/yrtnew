"use client";

import { useState } from "react";
import { Printer, FileText } from "lucide-react";
import PaymentReceiptModal, { ReceiptData } from "./PaymentReceiptModal";

interface PrintReceiptButtonProps {
  receiptData?: ReceiptData;
  className?: string;
  buttonText?: string;
}

export default function PrintReceiptButton({
  receiptData,
  className,
  buttonText = "Print Official Tax Receipt",
}: PrintReceiptButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const fallbackData: ReceiptData = receiptData || {
    linkCode: "PAY-RECEIPT",
    customerName: "Valued Traveler",
    purpose: "Travel Booking Services",
    amount: 0,
    status: "paid",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ||
          "w-full py-3.5 rounded-2xl text-xs font-bold text-slate-800 bg-amber-400 hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        }
        title="Preview official A4 tax receipt and save as PDF"
      >
        <Printer className="w-4 h-4 text-slate-900" />
        <span>{buttonText}</span>
      </button>

      {isOpen && (
        <PaymentReceiptModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          data={fallbackData}
        />
      )}
    </>
  );
}
