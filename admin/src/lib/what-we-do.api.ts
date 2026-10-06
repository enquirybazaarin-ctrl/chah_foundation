import api from './api';
import type {
  WhatWeDoCard,
  WhatWeDoSectionSettings,
  CreateWhatWeDoCardPayload,
  UpdateWhatWeDoCardPayload,
} from './types';

interface WhatWeDoListResponse {
  status: string;
  data: {
    cards: WhatWeDoCard[];
    section: WhatWeDoSectionSettings;
  };
}

interface WhatWeDoDetailResponse {
  status: string;
  data: {
    card: WhatWeDoCard;
  };
}

interface WhatWeDoSettingsResponse {
  status: string;
  data: {
    section: WhatWeDoSectionSettings;
  };
}

/**
 * Fetch all What We Do cards and section settings (admin view).
 */
export async function getWhatWeDoAdmin(): Promise<{
  cards: WhatWeDoCard[];
  section: WhatWeDoSectionSettings;
}> {
  const res = await api.get<WhatWeDoListResponse>('/api/v1/what-we-do/admin/all');
  return res.data.data;
}

/**
 * Fetch a single What We Do card by ID.
 */
export async function getWhatWeDoCardById(id: string): Promise<WhatWeDoCard> {
  const res = await api.get<WhatWeDoDetailResponse>(`/api/v1/what-we-do/${id}`);
  return res.data.data.card;
}

/**
 * Create a new What We Do card.
 */
export async function createWhatWeDoCard(payload: CreateWhatWeDoCardPayload): Promise<WhatWeDoCard> {
  const res = await api.post<WhatWeDoDetailResponse>('/api/v1/what-we-do', payload);
  return res.data.data.card;
}

/**
 * Update an existing What We Do card.
 */
export async function updateWhatWeDoCard(
  id: string,
  payload: UpdateWhatWeDoCardPayload
): Promise<WhatWeDoCard> {
  const res = await api.put<WhatWeDoDetailResponse>(`/api/v1/what-we-do/${id}`, payload);
  return res.data.data.card;
}

/**
 * Toggle active status of a What We Do card.
 */
export async function toggleWhatWeDoCard(id: string, is_active?: boolean): Promise<WhatWeDoCard> {
  const res = await api.patch<WhatWeDoDetailResponse>(`/api/v1/what-we-do/${id}/toggle`, { is_active });
  return res.data.data.card;
}

/**
 * Delete a What We Do card.
 */
export async function deleteWhatWeDoCard(id: string): Promise<void> {
  await api.delete(`/api/v1/what-we-do/${id}`);
}

/**
 * Update section header and subtitle settings.
 */
export async function updateWhatWeDoSettings(
  settings: Partial<WhatWeDoSectionSettings>
): Promise<WhatWeDoSectionSettings> {
  const res = await api.put<WhatWeDoSettingsResponse>('/api/v1/what-we-do/settings', settings);
  return res.data.data.section;
}
