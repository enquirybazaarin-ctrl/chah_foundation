import api from './api';
import type { HeroSlide, CreateHeroSlidePayload, UpdateHeroSlidePayload } from './types';

interface HeroSlideListResponse {
  status: string;
  data: {
    slides: HeroSlide[];
  };
}

interface HeroSlideDetailResponse {
  status: string;
  data: {
    slide: HeroSlide;
  };
}

/**
 * Fetch all hero slides (admin view).
 */
export async function getHeroSlidesAdmin(): Promise<HeroSlide[]> {
  const res = await api.get<HeroSlideListResponse>('/api/v1/hero-slides/admin/all');
  return res.data.data.slides;
}

/**
 * Fetch a single hero slide by ID.
 */
export async function getHeroSlideById(id: string): Promise<HeroSlide> {
  const res = await api.get<HeroSlideDetailResponse>(`/api/v1/hero-slides/${id}`);
  return res.data.data.slide;
}

/**
 * Create a new hero slide.
 */
export async function createHeroSlide(payload: CreateHeroSlidePayload): Promise<HeroSlide> {
  const res = await api.post<HeroSlideDetailResponse>('/api/v1/hero-slides', payload);
  return res.data.data.slide;
}

/**
 * Update an existing hero slide.
 */
export async function updateHeroSlide(id: string, payload: UpdateHeroSlidePayload): Promise<HeroSlide> {
  const res = await api.put<HeroSlideDetailResponse>(`/api/v1/hero-slides/${id}`, payload);
  return res.data.data.slide;
}

/**
 * Toggle active status of a hero slide.
 */
export async function toggleHeroSlide(id: string, is_active?: boolean): Promise<HeroSlide> {
  const res = await api.patch<HeroSlideDetailResponse>(`/api/v1/hero-slides/${id}/toggle`, { is_active });
  return res.data.data.slide;
}

/**
 * Delete a hero slide.
 */
export async function deleteHeroSlide(id: string): Promise<void> {
  await api.delete(`/api/v1/hero-slides/${id}`);
}
