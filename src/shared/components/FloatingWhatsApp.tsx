"use client";

import WhatsAppIcon from "./WhatsAppIcon";

interface FloatingWhatsAppProps {
  phone?: string;
  defaultMessage?: string;
}

export default function FloatingWhatsApp({
  phone = "919100228152",
  defaultMessage = "Hi Yellow Ribbon Travels! I would like to inquire about holiday packages and flight bookings.",
}: FloatingWhatsAppProps) {
  const cleanPhone = phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside
      aria-label="WhatsApp quick chat"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 group print:hidden"
    >
      <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-full shadow-lg border border-slate-700 pointer-events-none">
        Chat with our Travel Desk
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Yellow Ribbon Travels"
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ring-2 sm:ring-4 ring-white/60"
      >
        <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-300 border-2 border-white"></span>
        </span>
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
      </a>
    </aside>
  );
}
