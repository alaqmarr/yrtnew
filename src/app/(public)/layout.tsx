import AnnouncementBar from "@/shared/components/AnnouncementBar";
import Navbar from "@/shared/components/Navbar";
import Footer from "@/shared/components/Footer";
import FloatingWhatsApp from "@/shared/components/FloatingWhatsApp";
import { siteSettingService } from "@/modules/site-settings/service/site-setting.service";

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await siteSettingService.getSettingsMap();

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-amber-50/40 via-white/80 to-cyan-50/40">
      {/* Subtle Ambient Background Orbs for Inner Pages */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden">
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-amber-300/12 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-rose-300/10 blur-3xl" />
      </div>

      {settings.announcement_banner_active === "true" && (
        <div className="print:hidden">
          <AnnouncementBar
            bannerText={settings.announcement_banner_text}
            phone={settings.phone_primary}
          />
        </div>
      )}
      <Navbar />
      <main className="flex-grow print:p-0 print:m-0">{children}</main>
      <div className="print:hidden">
        <Footer />
      </div>
      <FloatingWhatsApp phone={settings.whatsapp_number || settings.phone_primary} />
    </div>
  );
}
