import api from './api';
import type { Setting, UpsertSettingPayload } from './types';

/**
 * Fetch all settings
 */
export async function getSettings(): Promise<Setting[]> {
  const res = await api.get<{ status: string; data: { settings: Setting[] } }>('/api/v1/operations/settings');
  return res.data.data.settings;
}

/**
 * Upsert a setting
 */
export async function upsertSetting(payload: UpsertSettingPayload): Promise<Setting> {
  const res = await api.post<{ status: string; data: { setting: Setting } }>('/api/v1/operations/settings', payload);
  return res.data.data.setting;
}

/**
 * Delete a setting by key
 */
export async function deleteSetting(key: string): Promise<void> {
  await api.delete(`/api/v1/operations/settings/${key}`);
}
