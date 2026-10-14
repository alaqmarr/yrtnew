export interface SiteSetting {
  key: string;
  value: string;
  group_name: string;
  updated_at: string;
}

export type SiteSettingsMap = Record<string, string>;
