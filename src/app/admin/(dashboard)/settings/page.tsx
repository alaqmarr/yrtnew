import { siteSettingService } from "@/modules/site-settings/service/site-setting.service";
import AdminSettingsManager from "@/modules/site-settings/components/AdminSettingsManager";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await siteSettingService.getSettingsMap();
  return <AdminSettingsManager initialSettings={settings} />;
}
