"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Plane,
  Camera,
  Star,
  BookOpen,
  CalendarCheck,
  Building2,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  CreditCard,
  FileText,
  Receipt,
  FlaskConical,
  LifeBuoy,
  ShieldCheck,
  UserCheck,
  Server,
  type LucideIcon,
} from "lucide-react";

interface AdminSidebarProps {
  onNavigate?: () => void;
  isMobile?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: "overview",
    title: "Overview & Infra",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      {
        label: "RSL Server",
        href: "/admin/rsl-server",
        icon: Server,
        badge: "Live",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      },
    ],
  },
  {
    id: "leads_crm",
    title: "Leads, CRM & Support",
    items: [
      { label: "Tour Bookings", href: "/admin/bookings", icon: CalendarCheck },
      {
        label: "Flight Inquiries",
        href: "/admin/flight-inquiries",
        icon: Plane,
      },
      { label: "Customer CRM", href: "/admin/contacts", icon: UserCheck },
      { label: "Client Tickets", href: "/admin/tickets", icon: LifeBuoy },
    ],
  },
  {
    id: "commercials",
    title: "Quotes & Billing",
    items: [
      {
        label: "Client Itineraries",
        href: "/admin/itineraries",
        icon: FileText,
      },
      { label: "Invoices & Quotes", href: "/admin/invoices", icon: Receipt },
      { label: "Razorpay Links", href: "/admin/payments", icon: CreditCard },
    ],
  },
  {
    id: "catalog",
    title: "Catalog & Content",
    items: [
      { label: "Tours & Packages", href: "/admin/tours", icon: Compass },
      { label: "Destinations", href: "/admin/destinations", icon: MapPin },
      { label: "Photo Gallery", href: "/admin/gallery", icon: Camera },
      { label: "Travel Blogs", href: "/admin/blogs", icon: BookOpen },
      { label: "Google Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    id: "system",
    title: "Company & System",
    items: [
      { label: "Branch Offices", href: "/admin/branches", icon: Building2 },
      { label: "Team Members", href: "/admin/team", icon: Users },
      { label: "Staff & Admins", href: "/admin/users", icon: ShieldCheck },
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
      { label: "Beta & QA Sandbox", href: "/beta", icon: FlaskConical },
    ],
  },
];

export default function AdminSidebar({
  onNavigate,
  isMobile = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isLinkActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <aside
      className={`${
        isMobile ? "w-full h-full" : "w-64 h-screen sticky top-0"
      } bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none overflow-hidden z-40`}
    >
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-slate-800/80 shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-brand-yellow via-brand-coral to-brand-cyan shrink-0">
            <div className="w-full h-full bg-white rounded-full p-1 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Yellow Ribbon Travels"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
          </div>
          <div className="min-w-0">
            <span className="font-bold text-base text-white tracking-tight block truncate">
              YR Admin
            </span>
            <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase block">
              Management Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Categorised Navigation Sections */}
      <nav className="flex-1 min-h-0 px-3.5 py-4 space-y-5 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">
        {NAV_SECTIONS.map((section) => {
          const hasActiveChild = section.items.some((item) =>
            isLinkActive(item.href)
          );
          const isCollapsed =
            Boolean(collapsedSections[section.id]) && !hasActiveChild;

          return (
            <div key={section.id} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <span>{section.title}</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-600 transition-transform duration-150 ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                />
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5">
                  {section.items.map((link) => {
                    const Icon = link.icon;
                    const isActive = isLinkActive(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onNavigate}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? "text-slate-950" : "text-slate-400"
                            }`}
                          />
                          <span className="truncate">{link.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {link.badge && !isActive && (
                            <span
                              className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                                link.badgeColor ||
                                "bg-slate-800 text-slate-300 border-slate-700"
                              }`}
                            >
                              {link.badge}
                            </span>
                          )}
                          {isActive && (
                            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom user & logout */}
      <div className="p-3.5 border-t border-slate-800 space-y-2.5 shrink-0 bg-slate-900/95 backdrop-blur-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </span>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold">
            Live
          </span>
        </Link>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between px-1">
          <div className="truncate pr-2">
            <div className="text-xs font-bold text-white truncate">
              {session?.user?.name || "Admin User"}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {session?.user?.email || "admin@yellowribbon"}
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
