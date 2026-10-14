"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RazorpayCheckoutButton from "./RazorpayCheckoutButton";
import PrintReceiptButton from "./PrintReceiptButton";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
  Printer,
  Sparkles,
  ArrowRight,
  PhoneCall,
  FileCheck,
} from "lucide-react";

interface PayOnlinePortalProps {
  isTest?: boolean;
}

export default function PayOnlinePortal({ isTest = false }: PayOnlinePortalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"custom" | "code">("custom");

  // Custom Payment Form State
  const [amount, setAmount] = useState<number>(5000);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+91 ");
  const [purpose, setPurpose] = useState("Holiday Package Advance Deposit");
  const [reference, setReference] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Code Search State
  const [lookupCode, setLookupCode] = useState("");

  // Paid State
  const [paidDetails, setPaidDetails] = useState<{
    paymentId: string;
    orderId: string;
    amount: number;
    purpose: string;
    date: string;
  } | null>(null);

  const fillTestData = () => {
    setAmount(2500);
    setCustomerName("Beta QA Tester");
    setCustomerEmail("qa.tester@yellowribbontravels.com");
    setCustomerPhone("+91 98765 43210");
    setPurpose("Test Package Advance Deposit");
    setReference("BETA-TEST-001");
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupCode.trim()) {
      const targetBase = isTest ? "/beta/pay" : "/pay";
      router.push(`${targetBase}/${encodeURIComponent(lookupCode.trim())}`);
    }
  };

  const handleSuccess = (details: { paymentId: string; orderId: string }) => {
    setPaidDetails({
      paymentId: details.paymentId,
      orderId: details.orderId,
      amount: amount,
      purpose: purpose + (reference ? ` (Ref: ${reference})` : ""),
      date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });
  };

  if (paidDetails) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-12 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Payment Successful
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            Thank You, {customerName || "Valued Traveler"}!
          </h2>
          <p className="text-sm text-slate-600">
            Your transaction has been processed and verified via Razorpay.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between pb-3 border-b border-slate-200">
            <span className="text-slate-500">Amount Paid</span>
            <span className="font-extrabold text-base text-slate-900">₹{paidDetails.amount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Razorpay Payment ID</span>
            <span className="font-mono font-bold text-slate-800">{paidDetails.paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Purpose</span>
            <span className="font-medium text-slate-800 text-right">{paidDetails.purpose}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Date & Time</span>
            <span className="text-slate-700">{paidDetails.date}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <PrintReceiptButton
            receiptData={{
              linkCode: `PAY-${paidDetails.paymentId.slice(-6).toUpperCase()}`,
              customerName: customerName || "Valued Traveler",
              customerPhone: customerPhone || undefined,
              customerEmail: customerEmail || undefined,
              purpose: paidDetails.purpose,
              amount: paidDetails.amount,
              status: "paid",
              paymentId: paidDetails.paymentId,
              paidAt: new Date().toISOString(),
            }}
            className="px-5 py-3 rounded-xl text-xs font-bold text-slate-800 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            buttonText="Print Official Receipt"
          />

          <a
            href={`https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20have%20completed%20online%20payment%20of%20₹${paidDetails.amount}%20with%20Payment%20ID:%20${paidDetails.paymentId}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors flex items-center gap-2 shadow-sm"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Send Confirmation on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto space-y-10">
      {/* Test / Sandbox Environment Banner */}
      {isTest && (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-2xl bg-amber-500 text-white text-lg shrink-0">🧪</span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm sm:text-base text-slate-900">
                    Razorpay Beta Sandbox Active (/beta/pay)
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white">
                    Test Mode
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Using test credentials from SQLite database (<code className="font-mono text-amber-800 bg-amber-100/60 px-1 py-0.5 rounded">razorpay_key_id_test</code>). No actual money will be charged.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fillTestData}
              className="px-4 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 transition-colors shrink-0 shadow-sm"
            >
              Fill Sample Test Data
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-3 border-t border-amber-500/20 text-slate-700">
            <div className="bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
              <span className="font-bold block text-amber-900">Test Card Number:</span>
              <code className="font-mono text-xs font-bold select-all">4111 1111 1111 1111</code>
              <span className="block text-[10px] text-slate-500 mt-0.5">Exp: 12/28 | CVV: 123</span>
            </div>
            <div className="bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
              <span className="font-bold block text-amber-900">Test UPI ID:</span>
              <code className="font-mono text-xs font-bold select-all">success@razorpay</code>
              <span className="block text-[10px] text-slate-500 mt-0.5">Simulates instant UPI approval</span>
            </div>
            <div className="bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
              <span className="font-bold block text-amber-900">Test OTP:</span>
              <code className="font-mono text-xs font-bold select-all">123456</code>
              <span className="block text-[10px] text-slate-500 mt-0.5">Any 4 or 6 digit number</span>
            </div>
          </div>
        </div>
      )}

      {/* Switcher Tabs */}
      <div className="flex items-center justify-center gap-3 bg-slate-100/80 p-1.5 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("custom")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === "custom"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Quick Custom Payment
        </button>

        <button
          onClick={() => setActiveTab("code")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === "code"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Lookup Payment Code
        </button>
      </div>

      {activeTab === "code" ? (
        /* Code Lookup Box */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-card max-w-xl mx-auto space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Enter Your Payment Link Code
            </h3>
            <p className="text-xs text-slate-500">
              Sent to you by your Yellow Ribbon Travel Architect via WhatsApp or Email.
            </p>
          </div>

          <form onSubmit={handleLookupSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                placeholder="e.g. PAY-KASHMIR-9421"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-center font-mono font-bold text-base uppercase tracking-wider focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>View & Pay Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Custom Payment Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-card space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                Payment Details
              </h3>
              <p className="text-xs text-slate-500">
                Processed via 256-bit encrypted Razorpay payment gateway.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              {/* Amount with Quick Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Amount to Pay (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-200 text-lg font-black text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="Enter amount"
                  />
                </div>

                {/* Quick amount chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[2500, 5000, 10000, 25000, 50000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        amount === preset
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      ₹{preset.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Purpose *
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                >
                  <option value="Holiday Package Advance Deposit">Holiday Package Advance Deposit</option>
                  <option value="Holiday Package Balance Payment">Holiday Package Balance Payment</option>
                  <option value="Air Ticket / Flight Booking">Air Ticket / Flight Booking</option>
                  <option value="Visa Documentation & Processing Fee">Visa Documentation & Processing Fee</option>
                  <option value="Hotel Reservation Deposit">Hotel Reservation Deposit</option>
                  <option value="Custom Itinerary Advance">Custom Itinerary Advance</option>
                  <option value="Other Travel Service">Other Travel Service</option>
                </select>
              </div>

              {/* Customer Name & WhatsApp Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Customer Email & Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address (For Instant Receipt)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Booking / Quote Reference ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. YRT-2026-904"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Razorpay Checkout Trigger */}
              <div className="pt-4 border-t border-slate-100">
                <RazorpayCheckoutButton
                  amount={amount}
                  purpose={purpose + (reference ? ` [${reference}]` : "")}
                  customerName={customerName || "Traveler"}
                  customerEmail={customerEmail}
                  customerPhone={customerPhone}
                  isTest={isTest}
                  buttonText={
                    isTest
                      ? `Test Pay ₹${amount.toLocaleString("en-IN")} (Sandbox)`
                      : `Proceed to Pay ₹${amount.toLocaleString("en-IN")} via Razorpay`
                  }
                  className="w-full py-4 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-brand-yellow via-amber-500 to-amber-600 hover:opacity-95 shadow-xl shadow-amber-500/25"
                  onSuccess={handleSuccess}
                  onError={(err) => setErrorMessage(err)}
                />
              </div>
            </div>
          </div>

          {/* Right Summary & Security Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <h4 className="font-bold text-sm">Payment Breakdown</h4>
                  <p className="text-[11px] text-slate-400">Official Yellow Ribbon Desk</p>
                </div>
              </div>

              <div className="space-y-3 text-xs border-y border-slate-800 py-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Amount:</span>
                  <span className="font-bold">₹{amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gateway Processing Fee:</span>
                  <span className="text-emerald-400 font-bold">₹0 (Waived)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Currency:</span>
                  <span className="font-bold">INR (Indian Rupee)</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-black pt-1">
                <span>Total Payable:</span>
                <span className="text-amber-400 text-xl">₹{amount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Security Badges */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Bank-Grade Payment Security</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Accepts UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Instant computerized tax receipt generated immediately</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>24/7 payment support line on WhatsApp</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Secured by Razorpay</span>
                <span>PCI-DSS Level 1</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
