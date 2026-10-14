"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Loader2,
  FlaskConical,
  CheckCircle2,
  XCircle,
  X,
  CreditCard,
  Smartphone,
  Building,
  Sparkles,
} from "lucide-react";

interface RazorpayCheckoutButtonProps {
  amount: number;
  currency?: string;
  purpose: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  linkCode?: string;
  buttonText?: string;
  className?: string;
  isTest?: boolean;
  onSuccess?: (details: { paymentId: string; orderId: string }) => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface SimulatedOrderData {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  mode: "live" | "test";
}

export default function RazorpayCheckoutButton({
  amount,
  currency = "INR",
  purpose,
  customerName,
  customerEmail = "",
  customerPhone,
  linkCode,
  buttonText = "Pay Securely with Razorpay",
  className = "",
  isTest = false,
  onSuccess,
  onError,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [simulatedOrder, setSimulatedOrder] = useState<SimulatedOrderData | null>(null);
  const [simulatingMethod, setSimulatingMethod] = useState<string | null>(null);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      if (onError) onError("Please enter a valid payment amount.");
      return;
    }
    if (!customerPhone || customerPhone.trim().length < 6) {
      if (onError) onError("Please provide a valid phone number.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Order on Server (strictly database controlled)
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          purpose,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          link_code: linkCode,
          isTest,
        }),
      });

      const orderData: SimulatedOrderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error((orderData as any).error || "Failed to initiate payment");
      }

      // Step 2: Determine if this should use the Sandbox Simulator Modal
      const isPlaceholderTestKey =
        orderData.keyId.includes("YellowRibbonTravels") ||
        !orderData.keyId.startsWith("rzp_test_");
      const isSimulatedOrderId = orderData.orderId.startsWith("order_sim_");

      if (isTest && (isPlaceholderTestKey || isSimulatedOrderId)) {
        // Direct to in-app Sandbox Simulation Modal without triggering Razorpay CDN 401 error
        setSimulatedOrder(orderData);
        setShowSandboxModal(true);
        setLoading(false);
        return;
      }

      // Step 3: Open Official Razorpay Checkout Modal
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        if (isTest) {
          // Fallback to simulator if script fails in test mode
          setSimulatedOrder(orderData);
          setShowSandboxModal(true);
          setLoading(false);
          return;
        }
        throw new Error("Unable to connect to Razorpay payment gateway. Please check your internet.");
      }

      const options = {
        key: orderData.keyId,
        amount: Math.round(amount * 100),
        currency: orderData.currency || "INR",
        name: isTest ? "Yellow Ribbon Travels (Sandbox)" : "Yellow Ribbon Travels",
        description: (isTest ? "[TEST MODE] " : "") + (purpose || "Travel Booking Deposit"),
        image: "/logo.png",
        order_id: isSimulatedOrderId ? undefined : orderData.orderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) {
          try {
            setLoading(true);
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id || orderData.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                linkCode,
                isTest,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              if (onSuccess) {
                onSuccess({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id || orderData.orderId,
                });
              } else {
                window.location.reload();
              }
            } else {
              throw new Error(verifyData.error || "Signature verification failed");
            }
          } catch (vErr) {
            if (onError) onError((vErr as Error).message);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          purpose,
          link_code: linkCode || "",
        },
        theme: {
          color: "#F59E0B",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      try {
        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response: any) {
          if (onError) onError(response?.error?.description || "Payment failed at gateway");
          setLoading(false);
        });
        paymentObject.open();
      } catch (clientErr) {
        if (isTest) {
          setSimulatedOrder(orderData);
          setShowSandboxModal(true);
        } else {
          throw clientErr;
        }
      }
    } catch (err) {
      if (onError) onError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedSuccess = async (methodName: string) => {
    if (!simulatedOrder) return;
    setSimulatingMethod(methodName);

    try {
      const simulatedPaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: simulatedOrder.orderId,
          paymentId: simulatedPaymentId,
          signature: "simulated_test_signature",
          linkCode,
          isTest: true,
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        setShowSandboxModal(false);
        if (onSuccess) {
          onSuccess({
            paymentId: simulatedPaymentId,
            orderId: simulatedOrder.orderId,
          });
        } else {
          window.location.reload();
        }
      } else {
        throw new Error(verifyData.error || "Sandbox verification failed");
      }
    } catch (err) {
      if (onError) onError((err as Error).message);
    } finally {
      setSimulatingMethod(null);
    }
  };

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 cursor-pointer ${
          className ||
          "px-6 py-3.5 rounded-2xl text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/25"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Connecting Payment Gateway...</span>
          </>
        ) : (
          <>
            {isTest ? (
              <FlaskConical className="w-5 h-5 text-amber-200" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {/* Razorpay Beta Sandbox Simulator Modal */}
      {showSandboxModal && simulatedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-300 relative space-y-6 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowSandboxModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-800 border border-amber-500/30">
                <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                <span>Razorpay Beta Sandbox Simulator</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                Simulate Payment Gateway
              </h3>
              <p className="text-xs text-slate-600">
                Safe testing environment. Simulate customer payments without using real cards or bank funds.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-2xl p-5 text-white space-y-3 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Payable Amount:</span>
                <span className="text-2xl font-black text-amber-400">
                  ₹{amount.toLocaleString("en-IN")}{" "}
                  <span className="text-xs font-bold text-slate-400">INR</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Traveler / Customer:</span>
                  <span className="font-semibold text-slate-200 truncate block">
                    {customerName || "Traveler"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact Phone:</span>
                  <span className="font-semibold text-slate-200">{customerPhone}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Payment Purpose:</span>
                  <span className="font-medium text-slate-300 truncate block">{purpose}</span>
                </div>
              </div>
            </div>

            {/* Simulation Action Buttons */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Select Test Action:
              </span>

              {/* Instant Success Button */}
              <button
                type="button"
                disabled={Boolean(simulatingMethod)}
                onClick={() => handleSimulatedSuccess("UPI / NetBanking")}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm flex items-center justify-between shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-black">Simulate Successful Payment</div>
                    <div className="text-[11px] text-emerald-100 font-normal">
                      Instant Razorpay approval & settlement
                    </div>
                  </div>
                </div>
                {simulatingMethod ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 text-emerald-200" />
                )}
              </button>

              {/* Instant UPI Simulator Button */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={Boolean(simulatingMethod)}
                  onClick={() => handleSimulatedSuccess("Google Pay / PhonePe UPI")}
                  className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">Simulate UPI</span>
                </button>

                <button
                  type="button"
                  disabled={Boolean(simulatingMethod)}
                  onClick={() => handleSimulatedSuccess("Credit/Debit Card")}
                  className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">Simulate Card</span>
                </button>
              </div>

              {/* Simulate Failure */}
              <button
                type="button"
                disabled={Boolean(simulatingMethod)}
                onClick={() => {
                  setShowSandboxModal(false);
                  if (onError) onError("Payment was simulated as cancelled or declined by tester.");
                }}
                className="w-full py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Simulate Cancelled / Failed Payment</span>
              </button>
            </div>

            {/* Footnote */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              <strong>Database Control Note:</strong> Public customer routes (<code className="font-mono text-slate-700 font-semibold">/pay</code>, <code className="font-mono text-slate-700 font-semibold">/invoice</code>) always use your live credentials directly. This sandbox desk allows team verification without credit card charges.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
