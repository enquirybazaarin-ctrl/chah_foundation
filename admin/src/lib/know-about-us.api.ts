import api from './api';
import type { KnowAboutUsData, UpdateKnowAboutUsPayload } from './types';

interface KnowAboutUsResponse {
  status: string;
  data: KnowAboutUsData;
}

/**
 * Fetch Know About Us content and images (admin view).
 */
export async function getKnowAboutUsAdmin(): Promise<KnowAboutUsData> {
  const res = await api.get<KnowAboutUsResponse>('/api/v1/know-about-us/admin');
  return res.data.data;
}

/**
 * Update Know About Us section text and configuration.
 */
export async function updateKnowAboutUs(payload: UpdateKnowAboutUsPayload): Promise<KnowAboutUsData> {
  const res = await api.put<KnowAboutUsResponse>('/api/v1/know-about-us', payload);
  return res.data.data;
}

/**
 * Add a new image to the Know About Us auto-slider.
 */
export async function addKnowAboutUsImage(imageUrl: string): Promise<KnowAboutUsData> {
  const res = await api.post<KnowAboutUsResponse>('/api/v1/know-about-us/images', { image_url: imageUrl });
  return res.data.data;
}

/**
 * Delete an image from the Know About Us auto-slider by index.
 */
export async function deleteKnowAboutUsImage(index: number): Promise<KnowAboutUsData> {
  const res = await api.post<KnowAboutUsResponse>('/api/v1/know-about-us/images/delete', { index });
  return res.data.data;
}
