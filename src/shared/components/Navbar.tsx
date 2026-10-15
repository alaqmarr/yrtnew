"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  ChevronDown,
  Plane,
  Compass,
  PhoneCall,
  MapPin,
  Star,
  Sparkles,
  User,
  LogOut,
  Ticket,
  CreditCard,
  Heart,
  LayoutDashboard,
  Users,
  FileText,
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const pathname = usePathname();

  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAboutEnter = () => {
    if (aboutTimeoutRef.current) {
      clearTimeout(aboutTimeoutRef.current);
      aboutTimeoutRef.current = null;
    }
    setAboutDropdown(true);
  };

  const handleAboutLeave = () => {
    if (aboutTimeoutRef.current) {
      clearTimeout(aboutTimeoutRef.current);
    }
    aboutTimeoutRef.current = setTimeout(() => {
      setAboutDropdown(false);
    }, 180);
  };

  const handleUserEnter = () => {
    if (userTimeoutRef.current) {
      clearTimeout(userTimeoutRef.current);
      userTimeoutRef.current = null;
    }
    setUserDropdown(true);
  };

  const handleUserLeave = () => {
    if (userTimeoutRef.current) {
      clearTimeout(userTimeoutRef.current);
    }
    userTimeoutRef.current = setTimeout(() => {
      setUserDropdown(false);
    }, 180);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
      if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setAboutDropdown(false);
    setUserDropdown(false);
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Tour Packages", href: "/tours" },
    { label: "Destinations", href: "/destinations" },
    { label: "Flight Bookings", href: "/flight-bookings" },
    { label: "Pay Online", href: "/pay" },
    { label: "Branches", href: "/branches" },
    { label: "Gallery", href: "/gallery" },
    { label: "Reviews", href: "/review" },
  ];

  const aboutSubLinks = [
    { label: "About Us", href: "/about", desc: "Our mission, vision and values" },
    { label: "Our Story", href: "/our-story", desc: "The journey behind Yellow Ribbon" },
    { label: "Our Team", href: "/team", desc: "Meet our travel architects" },
    { label: "Travel Blogs", href: "/blogs", desc: "Guides, visa tips & inspiration" },
  ];

  const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U";
  const firstName = session?.user?.name ? session.user.name.split(" ")[0] : "Account";
  const userRole = session?.user?.role;
  const isAdmin = userRole === "admin" || userRole === "superadmin" || userRole === "staff";

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
          : "bg-white/90 backdrop-blur-sm border-b border-slate-100"
      }`}
    >
      <div className="w-full px-3 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0">
            <div className="relative w-9 h-9 sm:w-12 sm:h-12 shrink-0 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-brand-yellow via-brand-coral to-brand-cyan shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-full p-0.5 sm:p-1 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Yellow Ribbon Travels"
                  width={44}
                  height={44}
                  className="object-contain w-7 h-7 sm:w-10 sm:h-10"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                YELLOW RIBBON
              </span>
              <span className="text-[8px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase font-semibold text-slate-500 flex items-center gap-1">
                TRAVELS & TOURS <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 2xl:space-x-2.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors relative whitespace-nowrap ${
                    isActive
                      ? "text-amber-600 font-semibold bg-amber-50/80"
                      : "text-slate-700 hover:text-amber-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-brand-yellow to-brand-coral rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleAboutEnter}
              onMouseLeave={handleAboutLeave}
            >
              <button
                type="button"
                onClick={() => setAboutDropdown((prev) => !prev)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  pathname.startsWith("/about") ||
                  pathname.startsWith("/our-story") ||
                  pathname.startsWith("/team") ||
                  pathname.startsWith("/blogs")
                    ? "text-amber-600 font-semibold bg-amber-50/80"
                    : "text-slate-700 hover:text-amber-600 hover:bg-slate-50"
                }`}
              >
                <span>Company</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    aboutDropdown ? "rotate-180 text-amber-600" : ""
                  }`}
                />
              </button>

              {aboutDropdown && (
                <div
                  className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleAboutEnter}
                  onMouseLeave={handleAboutLeave}
                >
                  {/* Invisible Hit Bridge to bridge any gap between trigger and menu */}
                  <div className="absolute -top-2 left-0 right-0 h-4 bg-transparent pointer-events-auto" />

                  <div className="w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 relative">
                    {aboutSubLinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setAboutDropdown(false)}
                        className="block p-2.5 rounded-lg hover:bg-amber-50/80 transition-colors group"
                      >
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-amber-600">
                          {sub.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{sub.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                pathname === "/contact"
                  ? "text-amber-600 font-semibold bg-amber-50/80"
                  : "text-slate-700 hover:text-amber-600 hover:bg-slate-50"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* Client Portal Button / User Dropdown */}
            {session?.user ? (
              <div
                className="relative"
                onMouseEnter={handleUserEnter}
                onMouseLeave={handleUserLeave}
              >
                <button
                  type="button"
                  onClick={() => setUserDropdown((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-slate-900 border border-amber-300/60 transition-all shadow-xs"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                    {userInitial}
                  </div>
                  <span className="text-xs font-bold">{firstName}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      userDropdown ? "rotate-180 text-amber-600" : ""
                    }`}
                  />
                </button>

                {userDropdown && (
                  <div
                    className="absolute top-full right-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseEnter={handleUserEnter}
                    onMouseLeave={handleUserLeave}
                  >
                    {/* Invisible Hit Bridge */}
                    <div className="absolute -top-2 left-0 right-0 h-4 bg-transparent pointer-events-auto" />

                    <div className="w-60 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 relative">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="font-bold text-xs text-slate-900">{session.user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{session.user.email}</div>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-500" />
                        <span>Client Dashboard</span>
                      </Link>

                      <Link
                        href="/account?tab=family"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl"
                      >
                        <Users className="w-4 h-4 text-amber-600" />
                        <span>My Family & Members</span>
                      </Link>

                      <Link
                        href="/account?tab=bookings"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl"
                      >
                        <Compass className="w-4 h-4 text-amber-500" />
                        <span>My Bookings & Trips</span>
                      </Link>

                      <Link
                        href="/account?tab=itineraries"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl"
                      >
                        <FileText className="w-4 h-4 text-cyan-500" />
                        <span>Custom Itineraries</span>
                      </Link>

                      <Link
                        href="/account?tab=payments"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl"
                      >
                        <CreditCard className="w-4 h-4 text-emerald-500" />
                        <span>Payments & Invoices</span>
                      </Link>

                      <Link
                        href="/account?tab=tickets"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl"
                      >
                        <Ticket className="w-4 h-4 text-indigo-500" />
                        <span>Support Tickets</span>
                      </Link>

                      <Link
                        href="/account?tab=favorites"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Saved Wishlist</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50/70 hover:bg-amber-100 rounded-xl mt-1"
                        >
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setUserDropdown(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/account/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-600 hover:bg-amber-50/70 border border-slate-200/80 transition-all shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>Client Portal</span>
              </Link>
            )}

            <a
              href="tel:+919100228152"
              className="hidden 2xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-600 hover:bg-amber-50/60 transition-colors border border-slate-200/80"
              title="24/7 Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
              <span>+91 91002 28152</span>
            </a>

            <a
              href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20am%20interested%20in%20a%20tour%20package."
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-full transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center justify-center"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
            </a>

            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-brand-yellow via-amber-500 to-brand-coral hover:opacity-95 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Tours</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/account"
              className="p-1.5 sm:p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              title="Client Portal"
            >
              <User className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-full transition-colors"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {/* Mobile Client Portal Banner */}
            <div className="p-3 mb-2 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  {userInitial}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    {session?.user ? session.user.name : "Traveler Portal"}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {session?.user ? "Manage bookings & tickets" : "Sign in to view journeys"}
                  </div>
                </div>
              </div>
              <Link
                href="/account"
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                {session?.user ? "Dashboard" : "Sign In"}
              </Link>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                  pathname === link.href
                    ? "bg-amber-50 text-amber-600 font-semibold"
                    : "text-slate-800 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-slate-100">
              <div className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                Company & Guides
              </div>
              {aboutSubLinks.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-600"
                >
                  {sub.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-600"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/account"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-slate-900 bg-amber-100 hover:bg-amber-200 border border-amber-300/60"
            >
              <User className="w-4 h-4 text-amber-600" />
              <span>Go to Client Portal</span>
            </Link>
            <a
              href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20would%20like%20to%20plan%20a%20holiday%20trip!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-sm transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>WhatsApp Consultation</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
