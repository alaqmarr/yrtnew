"use client";

import { useEffect, useState, useMemo } from "react";
import QRCode from "qrcode";
import YellowRibbonHeader from "@/modules/itineraries/components/YellowRibbonHeader";
import WorldSkylineFooter from "@/modules/itineraries/components/WorldSkylineFooter";
import { numberToIndianWords } from "@/shared/utils/numberToWords";
import { ReceiptData } from "./PaymentReceiptModal";
import { CheckCircle2, ShieldCheck, Phone, Mail, MapPin } from "lucide-react";

interface OfficialPaymentReceiptDocumentProps {
  data: ReceiptData;
}

export default function OfficialPaymentReceiptDocument({
  data,
}: OfficialPaymentReceiptDocumentProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  const isPaid = data.status === "paid" || !!data.paymentId;

  // Generate verification URL & QR Code
  useEffect(() => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://yellowribbontravels.com";
    const verificationUrl = `${origin}/pay/${data.linkCode}`;

    QRCode.toDataURL(verificationUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [data.linkCode]);

  // Formatted Date
  const formattedDate = useMemo(() => {
    const dateSource = data.paidAt || data.createdAt;
    if (!dateSource) {
      return new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    const d = new Date(dateSource);
    return `${d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}, ${d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  }, [data.paidAt, data.createdAt]);

  const baseTaxableAmount = Math.round(data.amount / 1.05);
  const gstAmount = data.amount - baseTaxableAmount;
  const amountInWords = numberToIndianWords(data.amount);

  return (
    <div
      id="printable-receipt-document"
      className="w-full max-w-[840px] bg-white text-slate-900 rounded-2xl print:rounded-none shadow-2xl print:shadow-none border border-slate-200/90 print:border-none p-6 sm:p-10 print:p-0 space-y-5 print:space-y-4 print:m-0 mx-auto"
    >
      {/* 1. OFFICIAL HIGH-RES CORPORATE HEADER */}
      <div className="border-b-2 border-amber-400/80 pb-3">
        <YellowRibbonHeader />
      </div>

      {/* 2. RECEIPT TITLE & STATUS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl print:bg-slate-900 print:text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black tracking-wider uppercase text-amber-400">
              Official Payment Receipt & Tax Voucher
            </h1>
          </div>
          <p className="text-[10px] text-slate-300 font-medium">
            Issued under Rule 46 of CGST Rules, 2017 • SAC Code 998555 (Tour Operator Services)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPaid ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Payment Received & Verified</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
              <span>● Pro-Forma (Pending)</span>
            </span>
          )}
        </div>
      </div>

      {/* 3. CORPORATE TAX METADATA & HELPLINE BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
            Receipt / Voucher No
          </span>
          <span className="font-mono font-black text-slate-950 text-xs">
            YRT-REC-{data.linkCode}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
            Date & Timestamp
          </span>
          <span className="font-bold text-slate-800 text-xs" suppressHydrationWarning>
            {formattedDate}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
            GSTIN / Unique Tax ID
          </span>
          <span className="font-mono font-black text-slate-950 text-xs">
            36AAECY9102K1Z5
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
            State / Tax Code
          </span>
          <span className="font-bold text-slate-800 text-xs">
            Telangana (Code 36)
          </span>
        </div>
      </div>

      {/* 4. BILLED CLIENT & SETTLEMENT SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left: Traveler / Client Info */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1">
            Billed Traveler / Client
          </span>
          <div className="font-black text-sm text-slate-950">
            {data.customerName || "Valued Traveler"}
          </div>
          {data.customerPhone && (
            <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-0.5">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{data.customerPhone}</span>
            </div>
          )}
          {data.customerEmail && (
            <div className="text-xs text-slate-600 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{data.customerEmail}</span>
            </div>
          )}
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Place of Supply: Telangana (36) / Inter-State</span>
          </div>
        </div>

        {/* Right: Settlement & Gateway Info */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1 sm:text-right">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
            Payment Settlement Details
          </span>
          <div className="text-xs text-slate-700">
            Payment Mode: <strong className="text-slate-900">Razorpay Enterprise Gateway</strong>
          </div>
          <div className="text-xs text-slate-700">
            Transaction ID:{" "}
            <strong className="font-mono text-slate-950 font-bold">
              {data.paymentId || "ONLINE_GATEWAY"}
            </strong>
          </div>
          <div className="text-xs text-slate-700">
            Account Clearance:{" "}
            <strong className="text-emerald-700 font-bold">
              {isPaid ? "Credited to Central YRT Account" : "Awaiting Authorization"}
            </strong>
          </div>
          <div className="text-[11px] text-slate-500 pt-0.5">
            Booking Reference: <strong className="font-mono text-slate-700">{data.linkCode}</strong>
          </div>
        </div>
      </div>

      {/* 5. ITEMIZED SERVICE CHARGES TABLE */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
            Particulars of Services Rendered
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            SAC: 998555 (Tour, Transfer & Accommodation Management)
          </span>
        </div>

        <div className="overflow-hidden border border-slate-300 rounded-xl print:border-slate-400">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold print:bg-slate-900 print:text-white">
                <th className="py-2.5 px-3.5 w-12 text-center">#</th>
                <th className="py-2.5 px-3.5">Service Particulars / Description</th>
                <th className="py-2.5 px-3.5 w-24 text-center">SAC Code</th>
                <th className="py-2.5 px-3.5 w-28 text-right">Taxable Base</th>
                <th className="py-2.5 px-3.5 w-24 text-right">5% GST</th>
                <th className="py-2.5 px-3.5 w-32 text-right">Total (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr className="bg-white">
                <td className="py-3 px-3.5 font-bold text-slate-400 text-center">01</td>
                <td className="py-3 px-3.5">
                  <div className="font-black text-slate-950 text-xs sm:text-sm">
                    {data.purpose}
                  </div>
                  {data.description && (
                    <div className="text-slate-600 text-[11px] mt-1 whitespace-pre-line leading-relaxed">
                      {data.description}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 font-medium mt-1">
                    ✓ Handpicked Stays • Private Transfers • Dedicated Tour Concierge
                  </div>
                </td>
                <td className="py-3 px-3.5 font-mono text-slate-700 text-center font-bold">
                  998555
                </td>
                <td className="py-3 px-3.5 text-right font-medium text-slate-800">
                  ₹{baseTaxableAmount.toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-3.5 text-right font-medium text-slate-800">
                  ₹{gstAmount.toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-3.5 text-right font-black text-slate-950 text-sm">
                  ₹{data.amount.toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. FINANCIAL BREAKDOWN & AMOUNT IN WORDS */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
        {/* Left Column: Words & Policies */}
        <div className="sm:col-span-7 space-y-2.5">
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block mb-0.5">
              Amount Chargeable (in words):
            </span>
            <span className="font-bold text-slate-950 italic text-xs leading-relaxed block">
              Indian Rupees {amountInWords}
            </span>
          </div>

          <div className="text-[10.5px] text-slate-500 space-y-1 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
            <p className="font-medium text-slate-700">
              • <strong>Statutory GST Compliance:</strong> Tour operator 5% composite tax scheme (CGST 2.5% + SGST 2.5% / IGST 5%) is fully accounted for under SAC Code 998555.
            </p>
            <p>
              • <strong>Official Booking Proof:</strong> This computer-generated electronic receipt serves as official voucher documentation for airline boarding clearance, hotel check-in, and visa filing.
            </p>
            <p>
              • <strong>Amendments & Cancellations:</strong> Subject to standard Yellow Ribbon Travels terms & conditions detailed in the booking contract.
            </p>
          </div>
        </div>

        {/* Right Column: Commercial Summary Card */}
        <div className="sm:col-span-5 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Net Taxable Base:</span>
            <span className="font-semibold text-slate-800">₹{baseTaxableAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Integrated GST (5% Included):</span>
            <span className="font-semibold text-slate-800">₹{gstAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Convenience / Gateway Fee:</span>
            <span className="text-emerald-700 font-bold">₹0.00 (100% Waived)</span>
          </div>

          <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline">
            <span className="font-black text-xs uppercase tracking-wider text-slate-900">
              Total Amount Paid:
            </span>
            <span className="font-black text-lg sm:text-xl text-slate-950">
              ₹{data.amount.toLocaleString("en-IN")}{" "}
              <span className="text-xs font-bold text-slate-500">INR</span>
            </span>
          </div>
        </div>
      </div>

      {/* 7. DIGITAL VERIFICATION SEAL, QR CODE & SIGNATORY */}
      <div className="pt-3 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Verification Badge */}
        <div className="sm:col-span-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center p-1 text-emerald-700 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 block">
              Digitally Verified & Authenticated
            </span>
            <span className="text-[9.5px] text-slate-500 block">
              Secunderabad Central Accounts Desk • YRT Audit ID: {data.linkCode}-TAX
            </span>
          </div>
        </div>

        {/* Dynamic Verification QR Code */}
        <div className="sm:col-span-3 flex flex-col items-center justify-center text-center">
          {qrCodeDataUrl ? (
            <div className="flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeDataUrl}
                alt="Scan to verify receipt"
                className="w-16 h-16 object-contain rounded-md border border-slate-200 p-0.5 bg-white"
              />
              <span className="text-[8.5px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                Scan to Verify Online
              </span>
            </div>
          ) : (
            <div className="w-16 h-16 bg-slate-100 rounded-md animate-pulse" />
          )}
        </div>

        {/* Authorized Signatory */}
        <div className="sm:col-span-4 text-center sm:text-right">
          <div className="font-serif italic text-slate-900 text-xs font-bold tracking-wider mb-1">
            For Yellow Ribbon Travels Pvt. Ltd.
          </div>
          <div className="h-0.5 w-36 bg-slate-400 mx-auto sm:ml-auto mb-1" />
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-600 block">
            Authorized Accounts Signatory
          </span>
          <span className="text-[8.5px] text-slate-400 italic block">
            (Computer Generated • Authentic Digital Record)
          </span>
        </div>
      </div>

      {/* 8. OFFICIAL COLOURFUL WORLD SKYLINE FOOTER */}
      <div className="pt-2">
        <WorldSkylineFooter />
        <div className="text-center text-[9px] text-slate-400 pt-1 tracking-wide">
          Yellow Ribbon Travels Pvt. Ltd. • Registered Tour Operator • 2-2-51, Mittal Chambers, M.G. Road, Secunderabad, Telangana - 500003
        </div>
      </div>
    </div>
  );
}
