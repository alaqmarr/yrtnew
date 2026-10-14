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
    <div className="flex flex-col min-h-screen">
      {settings.announcement_banner_active === "true" && (
        <div className="print:hidden">
          <AnnouncementBar
            bannerText={settings.announcement_banner_text}
            phone={settings.phone_primary}
          />
        </div>
      )}
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="flex-grow print:p-0 print:m-0">{children}</main>
      <div className="print:hidden">
        <Footer />
      </div>
      <FloatingWhatsApp phone={settings.whatsapp_number || settings.phone_primary} />
    </div>
  );
}
