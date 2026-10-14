"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  CreditCard,
  FileText,
  Printer,
  Compass,
  Mail,
  Cloud,
  CheckCircle2,
  XCircle,
  Play,
  Copy,
  ExternalLink,
  ShieldCheck,
  Server,
  Zap,
} from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";

interface BetaLabViewProps {
  razorpayMode: string;
  testKeyId: string;
  liveKeyId: string;
  sampleItineraryId: string;
  sampleInvoiceId: string;
  samplePaymentCode: string;
}

interface ApiTestResult {
  endpoint: string;
  status: "idle" | "running" | "success" | "error";
  statusCode?: number;
  timeMs?: number;
  data?: any;
  error?: string;
}

export default function BetaLabView({
  razorpayMode,
  testKeyId,
  liveKeyId,
  sampleItineraryId,
  sampleInvoiceId,
  samplePaymentCode,
}: BetaLabViewProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // API Tests State
  const [testResults, setTestResults] = useState<Record<string, ApiTestResult>>({
    createOrder: { endpoint: "POST /api/payments/create-order (isTest: true)", status: "idle" },
    branches: { endpoint: "GET /api/branches", status: "idle" },
    tours: { endpoint: "GET /api/tours", status: "idle" },
    destinations: { endpoint: "GET /api/destinations", status: "idle" },
    settings: { endpoint: "GET /api/settings", status: "idle" },
  });

  const [testingAll, setTestingAll] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runApiTest = async (testName: string) => {
    setTestResults((prev) => ({
      ...prev,
      [testName]: { ...prev[testName], status: "running" },
    }));

    const startTime = performance.now();

    try {
      let res: Response;
      if (testName === "createOrder") {
        res = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 500,
            currency: "INR",
            purpose: "Beta API Diagnostic Test",
            customer_name: "QA Automated Tester",
            customer_phone: "+91 99999 88888",
            isTest: true,
          }),
        });
      } else if (testName === "branches") {
        res = await fetch("/api/branches");
      } else if (testName === "tours") {
        res = await fetch("/api/tours");
      } else if (testName === "destinations") {
        res = await fetch("/api/destinations");
      } else {
        res = await fetch("/api/settings");
      }

      const elapsed = Math.round(performance.now() - startTime);
      const data = await res.json();

      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          ...prev[testName],
          status: res.ok ? "success" : "error",
          statusCode: res.status,
          timeMs: elapsed,
          data: data,
          error: res.ok ? undefined : (data.error || "Request failed"),
        },
      }));
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          ...prev[testName],
          status: "error",
          timeMs: elapsed,
          error: (err as Error).message,
        },
      }));
    }
  };

  const runAllApiTests = async () => {
    setTestingAll(true);
    const tests = ["createOrder", "branches", "tours", "destinations", "settings"];
    for (const t of tests) {
      await runApiTest(t);
    }
    setTestingAll(false);
  };

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-10 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Yellow Ribbon Travels QA & Beta Test Suite</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Developer & QA Testing Suite
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            All sandbox tests and diagnostics are consolidated in this <code className="text-amber-400 font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded">/beta</code> environment. Here you can test payments with simulated credentials, verify client itineraries and invoices, and execute live API diagnostics.
          </p>

          {/* Active Config Status Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="text-slate-400">Database Active Mode:</span>
              <strong className={razorpayMode === "live" ? "text-emerald-400" : "text-amber-400"}>
                {razorpayMode === "live" ? "🟢 LIVE" : "🟡 TEST / SANDBOX"}
              </strong>
            </div>

            <div className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="text-slate-400">Beta Suite Mode:</span>
              <strong className="text-amber-300">🧪 Strictly Test Credentials</strong>
            </div>

            <div className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="text-slate-400">Test Key ID:</span>
              <strong className="font-mono text-amber-300">
                {testKeyId ? `${testKeyId.substring(0, 14)}...` : "rzp_test_..."}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Test Case Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Interactive Test Cases & Sandboxes
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Dedicated test routes with zero impact on production data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: /beta/pay */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative">
            <span className="absolute -top-3 right-6 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
              Primary Request
            </span>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Razorpay Test Payment Desk
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test checkout portal using test credentials from SQLite (<code className="font-mono text-amber-800">razorpay_key_id_test</code>). Test custom amounts, preset buttons, and simulated payment receipts.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/beta/pay"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Launch /beta/pay Desk</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: /beta/pay/[code] */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Payment Link Landing Tester
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Preview how a client sees and pays for a custom payment link generated from the admin panel, complete with WhatsApp share confirmation.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/beta/pay/${samplePaymentCode || "PAY-KASHMIR-9421"}`}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>Test Link: {samplePaymentCode || "PAY-KASHMIR-9421"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Itinerary PDF Letterhead */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Client Itinerary & PDF Letterhead
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verify day-by-day luxury travel itinerary view, total trip pricing, Razorpay payment button, and click <strong>"Print / Save as PDF"</strong> for official letterhead formatting.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/itinerary/${sampleItineraryId || "itin_demo_1"}`}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>View Sample Itinerary</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Invoice PDF Letterhead */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Client Tax Invoice & Quote
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verify line-item arithmetic, GST tax calculations, discount deductions, settlement button, and standard A4 PDF letterhead printout.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/invoice/${sampleInvoiceId || "inv_demo_1"}`}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>View Sample Tax Invoice</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 5: SMTP Test Tool */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                SMTP & Gmail Email Dispatcher
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test sending automated booking confirmations and flight query alerts via your database-stored Gmail App Password credentials.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/settings"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>Test in Admin Settings</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 6: Database Settings */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Razorpay Live/Test Key Manager
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Update, inspect, or toggle between Live and Test Razorpay API keys directly stored in SQLite (<code className="font-mono text-slate-700">travels.db</code>).
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/settings"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 font-bold"
              >
                <span>Manage Keys in Admin</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* QA Tester Quick Cheat Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-amber-600" />
          <span>QA Testing Cheat Sheet (Razorpay Sandbox Credentials)</span>
        </h3>

        <p className="text-xs text-slate-500">
          Click any credential below to instantly copy it to your clipboard for testing in <Link href="/beta/pay" className="underline font-bold text-amber-700">/beta/pay</Link>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Card 1 */}
          <div
            onClick={() => copyToClipboard("4111 1111 1111 1111", "card_success")}
            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50/60 hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Test Visa / MasterCard</span>
              <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
            </div>
            <div className="font-mono font-bold text-sm text-slate-900">4111 1111 1111 1111</div>
            <div className="text-[10px] text-slate-500 mt-1">Exp: 12/28 | CVV: 123 (Success)</div>
            {copiedKey === "card_success" && (
              <span className="text-[10px] font-bold text-emerald-600 block mt-1">Copied!</span>
            )}
          </div>

          {/* Card 2 */}
          <div
            onClick={() => copyToClipboard("success@razorpay", "upi_success")}
            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50/60 hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Instant UPI Handle</span>
              <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
            </div>
            <div className="font-mono font-bold text-sm text-slate-900">success@razorpay</div>
            <div className="text-[10px] text-slate-500 mt-1">Auto-approves simulated UPI</div>
            {copiedKey === "upi_success" && (
              <span className="text-[10px] font-bold text-emerald-600 block mt-1">Copied!</span>
            )}
          </div>

          {/* Card 3 */}
          <div
            onClick={() => copyToClipboard("failure@razorpay", "upi_fail")}
            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50/60 hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Simulate Failure UPI</span>
              <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
            </div>
            <div className="font-mono font-bold text-sm text-slate-900">failure@razorpay</div>
            <div className="text-[10px] text-slate-500 mt-1">Tests gateway decline handling</div>
            {copiedKey === "upi_fail" && (
              <span className="text-[10px] font-bold text-emerald-600 block mt-1">Copied!</span>
            )}
          </div>

          {/* Card 4 */}
          <div
            onClick={() => copyToClipboard("123456", "otp")}
            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50/60 hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Test 3D Secure OTP</span>
              <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
            </div>
            <div className="font-mono font-bold text-sm text-slate-900">123456</div>
            <div className="text-[10px] text-slate-500 mt-1">Bank authentication bypass</div>
            {copiedKey === "otp" && (
              <span className="text-[10px] font-bold text-emerald-600 block mt-1">Copied!</span>
            )}
          </div>
        </div>
      </div>

      {/* Live API Diagnostics Runner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Live API Health & Endpoint Diagnostics</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Execute live HTTP requests against server API endpoints to test response codes and latencies.
            </p>
          </div>

          <button
            onClick={runAllApiTests}
            disabled={testingAll}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{testingAll ? "Running Tests..." : "Run All API Diagnostics"}</span>
          </button>
        </div>

        <div className="space-y-3">
          {Object.entries(testResults).map(([key, item]) => (
            <div
              key={key}
              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col gap-2 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {item.status === "idle" && (
                    <span className="w-3 h-3 rounded-full bg-slate-300" />
                  )}
                  {item.status === "running" && (
                    <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                  )}
                  {item.status === "success" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {item.status === "error" && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {item.endpoint}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {item.timeMs !== undefined && (
                    <span className="text-[11px] font-mono text-slate-500">
                      {item.timeMs}ms
                    </span>
                  )}
                  {item.statusCode !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.statusCode >= 200 && item.statusCode < 300
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      HTTP {item.statusCode}
                    </span>
                  )}
                  <button
                    onClick={() => runApiTest(key)}
                    disabled={item.status === "running"}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 underline disabled:opacity-50"
                  >
                    Test
                  </button>
                </div>
              </div>

              {item.data && (
                <pre className="text-[10px] font-mono bg-white p-2.5 rounded-xl border border-slate-200 overflow-x-auto text-slate-700 max-h-32">
                  {JSON.stringify(item.data, null, 2)}
                </pre>
              )}

              {item.error && (
                <div className="text-xs text-rose-600 font-medium">
                  Error: {item.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
