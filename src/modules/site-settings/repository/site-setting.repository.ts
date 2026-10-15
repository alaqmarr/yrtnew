import { db } from "@/infrastructure/db/client";
import { SiteSetting, SiteSettingsMap } from "../domain/site-setting.entity";

export class SiteSettingRepository {
  async getAll(): Promise<SiteSetting[]> {
    try {
      const res = await db.execute("SELECT * FROM site_settings ORDER BY group_name ASC, key ASC");
      return res.rows.map((r) => ({
        key: String(r.key),
        value: String(r.value),
        group_name: String(r.group_name || "general"),
        updated_at: String(r.updated_at),
      }));
    } catch (err) {
      console.warn("Could not query site_settings:", (err as Error).message);
      return [];
    }
  }

  async getAllAsMap(): Promise<SiteSettingsMap> {
    const all = await this.getAll();
    const map: SiteSettingsMap = {};
    for (const item of all) {
      map[item.key] = item.value;
    }
    return map;
  }

  async getByKey(key: string, defaultValue = ""): Promise<string> {
    try {
      const res = await db.execute({
        sql: "SELECT value FROM site_settings WHERE key = ? LIMIT 1",
        args: [key],
      });
      if (!res.rows[0]) return defaultValue;
      return String(res.rows[0].value);
    } catch {
      return defaultValue;
    }
  }

  async setKey(key: string, value: string, groupName = "general"): Promise<void> {
    const now = new Date().toISOString();
    await db.execute({
      sql: `INSERT INTO site_settings (key, value, group_name, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET 
              value = excluded.value, 
              group_name = CASE WHEN excluded.group_name != 'general' THEN excluded.group_name ELSE site_settings.group_name END,
              updated_at = excluded.updated_at`,
      args: [key, value, groupName, now],
    });
  }

  async setBulk(settings: Record<string, { value: string; group?: string }>): Promise<void> {
    for (const [key, item] of Object.entries(settings)) {
      await this.setKey(key, item.value, item.group || "general");
    }
  }
}

export const siteSettingRepository = new SiteSettingRepository();
