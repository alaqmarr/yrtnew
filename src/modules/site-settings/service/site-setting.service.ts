import { siteSettingRepository } from "../repository/site-setting.repository";
import { SiteSetting, SiteSettingsMap } from "../domain/site-setting.entity";

export class SiteSettingService {
  async getAllSettings(): Promise<SiteSetting[]> {
    return siteSettingRepository.getAll();
  }

  async getSettingsMap(): Promise<SiteSettingsMap> {
    return siteSettingRepository.getAllAsMap();
  }

  async getSetting(key: string, defaultValue = ""): Promise<string> {
    return siteSettingRepository.getByKey(key, defaultValue);
  }

  async updateSetting(key: string, value: string, group?: string): Promise<void> {
    return siteSettingRepository.setKey(key, value, group);
  }

  async updateSettings(settings: Record<string, { value: string; group?: string }>): Promise<void> {
    return siteSettingRepository.setBulk(settings);
  }
}

export const siteSettingService = new SiteSettingService();
