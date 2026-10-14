"use client";

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
  CreditCard,
  FileText,
  Receipt,
  FlaskConical,
  LifeBuoy,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Customer CRM", href: "/admin/contacts", icon: UserCheck },
    { label: "Client Tickets", href: "/admin/tickets", icon: LifeBuoy },
    { label: "Staff & Admins", href: "/admin/users", icon: ShieldCheck },
    { label: "Razorpay Links", href: "/admin/payments", icon: CreditCard },
    { label: "Client Itineraries", href: "/admin/itineraries", icon: FileText },
    { label: "Invoices & Quotes", href: "/admin/invoices", icon: Receipt },
    { label: "Tours & Packages", href: "/admin/tours", icon: Compass },
    { label: "Destinations", href: "/admin/destinations", icon: MapPin },
    { label: "Tour Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { label: "Flight Inquiries", href: "/admin/flight-inquiries", icon: Plane },
    { label: "Photo Gallery", href: "/admin/gallery", icon: Camera },
    { label: "Google Reviews", href: "/admin/reviews", icon: Star },
    { label: "Travel Blogs", href: "/admin/blogs", icon: BookOpen },
    { label: "Branch Offices", href: "/admin/branches", icon: Building2 },
    { label: "Team Members", href: "/admin/team", icon: Users },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
    { label: "Beta & QA Sandbox", href: "/beta", icon: FlaskConical },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col border-r border-slate-800 shrink-0 select-none overflow-hidden z-40">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-brand-yellow via-brand-coral to-brand-cyan">
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
          <div>
            <span className="font-bold text-base text-white tracking-tight block">
              YR Admin
            </span>
            <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
              Management Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 min-h-0 p-4 space-y-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user & logout */}
      <div className="p-4 border-t border-slate-800 space-y-3 shrink-0 bg-slate-900/95 backdrop-blur-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Live</span>
        </Link>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
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
