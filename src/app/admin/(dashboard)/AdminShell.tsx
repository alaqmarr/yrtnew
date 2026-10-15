"use client";

import { useState } from "react";
import AdminSidebar from "@/shared/components/AdminSidebar";
import { Menu, X } from "lucide-react";

interface AdminShellProps {
  userName: string;
  children: React.ReactNode;
}

export default function AdminShell({ userName, children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-900 shadow-2xl flex flex-col z-50">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AdminSidebar onNavigate={() => setMobileMenuOpen(false)} isMobile={true} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              YR Admin
            </span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-xs font-bold text-amber-600 hidden sm:inline">
              Management Desk
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium text-slate-600">
            <span className="truncate max-w-[140px] sm:max-w-none">
              Welcome, <strong>{userName}</strong>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" title="Online" />
          </div>
        </header>

        {/* Content Body - only this scrolls */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto min-h-0">{children}</main>
      </div>
    </div>
  );
}
