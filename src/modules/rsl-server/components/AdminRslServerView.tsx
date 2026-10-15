"use client";

import { useState, useEffect, useRef, useCallback, createElement } from "react";
import Script from "next/script";
import {
  Server,
  Activity,
  Globe,
  ShieldCheck,
  BarChart3,
  CreditCard,
  LifeBuoy,
  RefreshCw,
  ExternalLink,
  Terminal,
  Lock,
  Cpu,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sun,
  Moon,
  Layers,
  Code2,
} from "lucide-react";

const DEFAULT_RSL_BASE_URL = "https://rsl.alaqmar.dev";
const DEFAULT_RSL_API_KEY =
  "rpk_live_YMzysplBDL5iXM48L1OLDXDT0dysiF3RvgCaS2cdsbY";
const DEFAULT_RSL_CLIENT_ID = "cli_01M5097SAH26DX9400N6WSYY1Q";

export interface RslWidgetSpec {
  id: string;
  title: string;
  tag: string;
  category:
    | "master"
    | "analytics"
    | "fleet"
    | "domains"
    | "billing"
    | "support";
  description: string;
  minHeight: number;
  fullWidth?: boolean;
}

export const RSL_WIDGET_CATALOG: RslWidgetSpec[] = [
  // Master Suite
  {
    id: "due-banner",
    title: "Due & Entitlement Alert Banner",
    tag: "<rsl-due-banner>",
    category: "master",
    description: "Real-time alert banner when billing dues or notices exist",
    minHeight: 130,
    fullWidth: true,
  },
  {
    id: "client-dashboard",
    title: "Unified RapidShift Client Dashboard",
    tag: "<rsl-client-dashboard>",
    category: "master",
    description:
      "All-in-one multi-tab client portal (Billing, Fleet, Domains, Support, Vault)",
    minHeight: 640,
    fullWidth: true,
  },

  // Web Analytics
  {
    id: "analytics-overview",
    title: "Visitor Intelligence & Analytics Suite",
    tag: "<rsl-analytics-overview>",
    category: "analytics",
    description:
      "Complete cookieless analytics suite: traffic chart, repeat viewers, top pages, referrers, journeys",
    minHeight: 580,
    fullWidth: true,
  },
  {
    id: "pageviews-chart",
    title: "Daily Pageviews & Repeat Visitors Chart",
    tag: "<rsl-pageviews-chart>",
    category: "analytics",
    description:
      "Daily pageviews, unique visitors, and repeat viewer area chart",
    minHeight: 380,
  },
  {
    id: "top-pages",
    title: "Top Pages, Referrers & Geo Countries",
    tag: "<rsl-top-pages>",
    category: "analytics",
    description: "Top routes, acquisition referrers, and visitor countries",
    minHeight: 380,
  },
  {
    id: "web-vitals",
    title: "Real Core Web Vitals Scorecard",
    tag: "<rsl-web-vitals>",
    category: "analytics",
    description:
      "Real Core Web Vitals (LCP, INP, CLS, FCP, TTFB) performance telemetry",
    minHeight: 360,
  },
  {
    id: "visitor-split",
    title: "Visitor Loyalty & Device Breakdown",
    tag: "<rsl-visitor-split>",
    category: "analytics",
    description: "Device, OS, and repeat vs. new visitor breakdown",
    minHeight: 360,
  },

  // Fleet & PM2
  {
    id: "server-overview",
    title: "Fleet & PM2 Server Overview",
    tag: "<rsl-server-overview>",
    category: "fleet",
    description: "Fleet summary of mapped PM2 processes, CPU, and RAM",
    minHeight: 360,
  },
  {
    id: "process-card",
    title: "Primary PM2 Process Status Card",
    tag: "<rsl-process-card>",
    category: "fleet",
    description: "Single PM2 process status card with restart control",
    minHeight: 360,
  },
  {
    id: "process-list",
    title: "Interactive PM2 Process Table",
    tag: "<rsl-process-list>",
    category: "fleet",
    description:
      "Interactive PM2 process table with Restart & Live Terminal Logs",
    minHeight: 420,
    fullWidth: true,
  },
  {
    id: "process-logs",
    title: "Live stdout/stderr Terminal Logs",
    tag: "<rsl-process-logs>",
    category: "fleet",
    description: "Real-time server process output and error log viewer",
    minHeight: 440,
    fullWidth: true,
  },

  // Domain Monitoring
  {
    id: "domain-status",
    title: "Domain Uptime, Latency & SSL Monitor",
    tag: "<rsl-domain-status>",
    category: "domains",
    description:
      "HTTP uptime status, response latency, SSL expiry, and instant re-check",
    minHeight: 420,
    fullWidth: true,
  },
  {
    id: "uptime-bars",
    title: "90-Day Availability Timeline",
    tag: "<rsl-uptime-bars>",
    category: "domains",
    description: "90-day visual availability timeline for monitored domains",
    minHeight: 320,
  },
  {
    id: "ssl-badge",
    title: "SSL Certificate Validity & Expiry",
    tag: "<rsl-ssl-badge>",
    category: "domains",
    description: "Compact SSL certificate validity and days-remaining status",
    minHeight: 320,
  },
  {
    id: "incident-feed",
    title: "Domain Outage & Recovery Feed",
    tag: "<rsl-incident-feed>",
    category: "domains",
    description: "Domain outage and recovery incident feed",
    minHeight: 360,
  },
  {
    id: "status-page",
    title: "Operational Status Page",
    tag: "<rsl-status-page>",
    category: "domains",
    description:
      "Public-style operational status page for all monitored client domains",
    minHeight: 460,
    fullWidth: true,
  },

  // Billing & Finance
  {
    id: "billing-summary",
    title: "Billing Summary & Balance Due",
    tag: "<rsl-billing-summary>",
    category: "billing",
    description:
      "Current balance due, total billed/paid, and 1-click invoice settlement",
    minHeight: 360,
  },
  {
    id: "contract-card",
    title: "Active Retainer & Contract Card",
    tag: "<rsl-contract-card>",
    category: "billing",
    description: "Active contract retainer, billing cycle, and tenure dates",
    minHeight: 360,
  },
  {
    id: "invoice-list",
    title: "Invoice Ledger & In-Place Settlement",
    tag: "<rsl-invoice-list>",
    category: "billing",
    description:
      "Full invoice ledger with breakdown and in-place online payment",
    minHeight: 440,
    fullWidth: true,
  },
  {
    id: "payment-history",
    title: "Verified Payment Receipts",
    tag: "<rsl-payment-history>",
    category: "billing",
    description: "Verified payment receipts and transaction references",
    minHeight: 380,
    fullWidth: true,
  },

  // Support Desk & Releases
  {
    id: "support-widget",
    title: "RapidShift Support Desk (Raise & Reply)",
    tag: "<rsl-support-widget>",
    category: "support",
    description: "Full support desk to raise tickets and reply to threads",
    minHeight: 520,
    fullWidth: true,
  },
  {
    id: "ticket-list",
    title: "Support Tickets & SLA Status",
    tag: "<rsl-ticket-list>",
    category: "support",
    description: "Active and resolved support tickets with SLA status",
    minHeight: 380,
  },
  {
    id: "sla-badge",
    title: "24×7 SLA Response Clock",
    tag: "<rsl-sla-badge>",
    category: "support",
    description: "Live 24×7 SLA response clock badge",
    minHeight: 280,
  },
  {
    id: "release-list",
    title: "Software Releases & Deployment Notes",
    tag: "<rsl-release-list>",
    category: "support",
    description:
      "Production, staging, and beta release notes & artifact downloads",
    minHeight: 380,
    fullWidth: true,
  },
];

interface RslEmbedCardProps {
  spec: RslWidgetSpec;
  theme: "dark" | "light";
  renderMode: "iframe" | "web-component";
  baseUrl?: string;
  apiKey?: string;
  clientId?: string;
}

function RslEmbedCard({
  spec,
  theme,
  renderMode,
  baseUrl = DEFAULT_RSL_BASE_URL,
  apiKey = DEFAULT_RSL_API_KEY,
  clientId = DEFAULT_RSL_CLIENT_ID,
}: RslEmbedCardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [dynamicHeight, setDynamicHeight] = useState<number>(spec.minHeight);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event?.data || event.data.type !== "rsl-embed-resize") return;
      if (
        iframeRef.current &&
        iframeRef.current.contentWindow === event.source
      ) {
        const nextH = Number(event.data.height);
        if (nextH && nextH >= 100) {
          setDynamicHeight(Math.max(spec.minHeight, nextH));
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [spec.minHeight]);

  const embedUrl = `${baseUrl}/embed/${encodeURIComponent(
    spec.id
  )}?apiKey=${encodeURIComponent(apiKey)}&clientId=${encodeURIComponent(
    clientId
  )}&theme=${theme}&accent=blue`;

  return (
    <div
      key={`${spec.id}-${theme}-${renderMode}`}
      className="w-full max-w-2xl mx-auto"
    >
      {renderMode === "web-component" ? (
        <div className="w-full">
          {createElement("rsl-embed", {
            widget: spec.id,
            "api-key": apiKey,
            "client-id": clientId,
            theme,
            endpoint: baseUrl,
            height: `${spec.minHeight}px`,
          })}
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={`RapidShift ${spec.title}`}
          className="rounded-2xl w-full"
          style={{
            width: "100%",
            height: `${dynamicHeight}px`,
            minHeight: `${spec.minHeight}px`,
            border: "none",
            display: "block",
            background: "transparent",
          }}
          loading="lazy"
          allow="clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
        />
      )}
    </div>
  );
}

interface RslClientDataPayload {
  clientId?: string;
  generatedAt?: string;
  client?: {
    id: string;
    name: string;
    slug?: string;
    status: string;
    city?: string;
    state?: string;
    country?: string;
  };
  gate?: {
    allowed: boolean;
    status: string;
    isBlocked?: boolean;
    tierStatus?: string;
  };
  billingSummary?: {
    totalBilledMinor: number;
    totalPaidMinor: number;
    outstandingMinor: number;
    overdueCount?: number;
    activeInvoicesCount?: number;
  };
  fleetProcesses?: Array<{
    id: string;
    pm2Id: number;
    name: string;
    status: string;
    cpu: number;
    memory: number;
    restarts: number;
    uptimeMs: number;
  }>;
  monitoredDomains?: Array<{
    id: string;
    name: string;
    hostname: string;
    targetUrl: string;
    status: string;
    lastHttpStatus: number;
    lastLatencyMs: number;
    sslStatus: string;
    sslDaysRemaining: number;
    sslIssuer: string;
    dnsStatus: string;
    domainRegistrar?: string;
    resolvedIp?: string;
  }>;
  analytics?: {
    overview?: {
      totalPageviews: number;
      uniqueVisitors: number;
      totalSessions: number;
      repeatVisitors: number;
      repeatVisitorRatePercent: number;
      bounceRatePercent: number;
      activeVisitorsNow: number;
    };
  };
}

export default function AdminRslServerView() {
  const [activeTab, setActiveTab] = useState<
    | "master"
    | "analytics"
    | "fleet"
    | "domains"
    | "billing"
    | "support"
    | "explorer"
  >("master");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [renderMode, setRenderMode] = useState<"iframe" | "web-component">(
    "iframe"
  );
  const [selectedExplorerWidget, setSelectedExplorerWidget] =
    useState<string>("client-dashboard");

  const [telemetry, setTelemetry] = useState<RslClientDataPayload | null>(null);
  const [healthStatus, setHealthStatus] = useState<{
    status?: string;
    database?: string;
    uptime?: number;
  } | null>(null);
  const [loadingTelemetry, setLoadingTelemetry] = useState<boolean>(true);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);

  const fetchRslTelemetry = useCallback(async () => {
    setLoadingTelemetry(true);
    setTelemetryError(null);
    try {
      const res = await fetch("/api/admin/rsl?days=30", { cache: "no-store" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setTelemetry(json.data || null);
      setHealthStatus(json.health || null);
    } catch (err) {
      setTelemetryError((err as Error).message);
    } finally {
      setLoadingTelemetry(false);
    }
  }, []);

  useEffect(() => {
    fetchRslTelemetry();
  }, [fetchRslTelemetry]);

  const primaryProcess = telemetry?.fleetProcesses?.[0];
  const primaryDomain = telemetry?.monitoredDomains?.[0];
  const analyticsOverview = telemetry?.analytics?.overview;
  const billingSummary = telemetry?.billingSummary;

  const formatMemoryMb = (bytes?: number) => {
    if (!bytes) return "0 MB";
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatUptime = (ms?: number) => {
    if (!ms) return "—";
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${totalMinutes % 60}m`;
    return `${totalMinutes}m`;
  };

  const tabs = [
    {
      id: "master" as const,
      label: "Master Control Suite",
      icon: Layers,
      badge: "All-in-One",
    },
    {
      id: "analytics" as const,
      label: "Visitor Analytics",
      icon: BarChart3,
      badge:
        analyticsOverview?.totalPageviews !== undefined
          ? `${analyticsOverview.totalPageviews} views`
          : undefined,
    },
    {
      id: "fleet" as const,
      label: "PM2 Fleet & Logs",
      icon: Terminal,
      badge: primaryProcess?.status || "online",
    },
    {
      id: "domains" as const,
      label: "Domains & SSL",
      icon: Globe,
      badge: primaryDomain?.sslDaysRemaining
        ? `${primaryDomain.sslDaysRemaining}d SSL`
        : undefined,
    },
    {
      id: "billing" as const,
      label: "Billing & Invoices",
      icon: CreditCard,
    },
    {
      id: "support" as const,
      label: "Support & Releases",
      icon: LifeBuoy,
    },
    {
      id: "explorer" as const,
      label: "All 24 Widgets",
      icon: Code2,
    },
  ];

  const activeWidgets = RSL_WIDGET_CATALOG.filter(
    (w) => w.category === activeTab
  );

  const explorerSpec =
    RSL_WIDGET_CATALOG.find((w) => w.id === selectedExplorerWidget) ||
    RSL_WIDGET_CATALOG[0];

  return (
    <div className="space-y-6">
      {/* Load RapidShift Native Web Component Runtime */}
      <Script
        src={`${DEFAULT_RSL_BASE_URL}/embed.js`}
        data-api-key={DEFAULT_RSL_API_KEY}
        data-client={DEFAULT_RSL_CLIENT_ID}
        strategy="afterInteractive"
      />

      {/* Top Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Server className="w-3.5 h-3.5" />
                <span>RapidShift Labs Control Plane</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {telemetry?.gate?.status || "Active"} •{" "}
                  {healthStatus?.status === "ok"
                    ? "Control Plane Healthy"
                    : "Connected"}
                </span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
                Client: {DEFAULT_RSL_CLIENT_ID}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              RSL Server Infrastructure, Analytics & Billing Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Live server operations, PM2 process telemetry (
              <code className="text-amber-300 font-mono">yrt</code>), SSL &
              domain uptime monitoring (
              <code className="text-cyan-300 font-mono">
                yellowribbontravels.com
              </code>
              ), cookieless visitor intelligence (
              <code className="text-blue-300 font-mono">t.js</code>), and client
              billing powered by{" "}
              <code className="text-slate-200 font-mono">
                rsl.alaqmar.dev
              </code>
              .
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Theme Toggle */}
            <div className="inline-flex items-center rounded-xl bg-slate-800 p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  theme === "dark"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  theme === "light"
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
            </div>

            {/* Render Mode Toggle */}
            <div className="inline-flex items-center rounded-xl bg-slate-800 p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setRenderMode("iframe")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  renderMode === "iframe"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Zero-JS Auto-Resizing Embed Iframes"
              >
                Iframe
              </button>
              <button
                type="button"
                onClick={() => setRenderMode("web-component")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  renderMode === "web-component"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Native <rsl-embed> Custom Elements via embed.js"
              >
                &lt;rsl-*&gt;
              </button>
            </div>

            <button
              type="button"
              onClick={fetchRslTelemetry}
              disabled={loadingTelemetry}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  loadingTelemetry ? "animate-spin" : ""
                }`}
              />
              <span>Sync Telemetry</span>
            </button>

            <a
              href="https://rsl.alaqmar.dev/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
            >
              <span>RSL Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Live API Telemetry Cards (/api/v1/client/data) */}
      {telemetryError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Could not fetch summary from /api/v1/client/data: {telemetryError}
            </span>
          </div>
          <button
            type="button"
            onClick={fetchRslTelemetry}
            className="px-3 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: PM2 Process Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              PM2 Fleet Process
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                primaryProcess?.status === "online"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {primaryProcess?.status || "online"}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-xl font-black text-slate-900 font-mono">
              {primaryProcess
                ? `${primaryProcess.name} (#${primaryProcess.pm2Id})`
                : "yrt (#21)"}
            </div>
            <span className="text-xs font-bold text-slate-500">
              Uptime: {formatUptime(primaryProcess?.uptimeMs)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            <div>
              <span className="text-slate-400 block">Memory</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-blue-600" />
                {formatMemoryMb(primaryProcess?.memory)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">CPU</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-amber-600" />
                {primaryProcess?.cpu ?? 0}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Restarts</span>
              <span className="font-bold text-slate-800">
                {primaryProcess?.restarts ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Domain & SSL Health */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Production Domain
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
              HTTP {primaryDomain?.lastHttpStatus || 200}
            </span>
          </div>
          <div className="text-base font-black text-slate-900 truncate">
            {primaryDomain?.hostname || "yellowribbontravels.com"}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            <div>
              <span className="text-slate-400 block">Latency</span>
              <span className="font-bold text-slate-800">
                {primaryDomain?.lastLatencyMs
                  ? `${primaryDomain.lastLatencyMs} ms`
                  : "—"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">SSL Valid</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                {primaryDomain?.sslDaysRemaining ?? 54}d left
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">DNS</span>
              <span className="font-bold text-slate-800 capitalize">
                {primaryDomain?.dnsStatus || "healthy"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Cookieless Visitor Analytics (t.js) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Visitor Telemetry (30d)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              <Activity className="w-3 h-3" />
              {analyticsOverview?.activeVisitorsNow ?? 0} Live Now
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900">
                {(analyticsOverview?.totalPageviews ?? 0).toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 ml-1.5">Pageviews</span>
            </div>
            <div className="text-xs font-bold text-slate-700">
              {(analyticsOverview?.uniqueVisitors ?? 0).toLocaleString()}{" "}
              Visitors
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            <div>
              <span className="text-slate-400 block">Sessions</span>
              <span className="font-bold text-slate-800">
                {analyticsOverview?.totalSessions ?? 0}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Repeat Rate</span>
              <span className="font-bold text-slate-800">
                {analyticsOverview?.repeatVisitorRatePercent ?? 0}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Tracker</span>
              <span className="font-bold text-emerald-700">t.js Active</span>
            </div>
          </div>
        </div>

        {/* Card 4: Access Gate & Billing */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Entitlement & Billing
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3 h-3" />
              {telemetry?.gate?.allowed !== false ? "Allowed" : "Restricted"}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900">
                ₹
                {(
                  (billingSummary?.outstandingMinor ?? 0) / 100
                ).toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-slate-500 ml-1.5">Due</span>
            </div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {billingSummary?.overdueCount
                ? `${billingSummary.overdueCount} Overdue`
                : "No Overdue"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            <div>
              <span className="text-slate-400 block">Total Paid</span>
              <span className="font-bold text-slate-800">
                ₹
                {((billingSummary?.totalPaidMinor ?? 0) / 100).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Active Invoices</span>
              <span className="font-bold text-slate-800">
                {billingSummary?.activeInvoicesCount ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-amber-400 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? "bg-amber-400/20 text-amber-300"
                      : "bg-slate-200/80 text-slate-700"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Embedded Widgets Grid */}
      {activeTab !== "explorer" ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {activeWidgets.map((spec) => (
            <RslEmbedCard
              key={spec.id}
              spec={spec}
              theme={theme}
              renderMode={renderMode}
            />
          ))}
        </div>
      ) : (
        /* Interactive 24-Widget Explorer */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>RapidShift 24-Widget Interactive Catalog</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select any of the 24 RapidShift embeddable widgets below to inspect its live view and integration tags.
                </p>
              </div>

              <select
                value={selectedExplorerWidget}
                onChange={(e) => setSelectedExplorerWidget(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {RSL_WIDGET_CATALOG.map((w) => (
                  <option key={w.id} value={w.id}>
                    [{w.category.toUpperCase()}] {w.title} ({w.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              {RSL_WIDGET_CATALOG.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedExplorerWidget(w.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                    selectedExplorerWidget === w.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {w.id}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <RslEmbedCard
              spec={explorerSpec}
              theme={theme}
              renderMode={renderMode}
            />
          </div>
        </div>
      )}
    </div>
  );
}
