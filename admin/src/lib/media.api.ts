import api from './api';
import type { PaginatedResponse, Media, MediaQueryParams } from './types';

export async function getMediaList(params: MediaQueryParams = {}): Promise<PaginatedResponse<Media>> {
  const res = await api.get<{ status: string; data: { media: Media[]; meta: any } }>(
    '/api/v1/media',
    { params }
  );
  const { media, meta } = res.data.data;
  return {
    data: media,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
}

export async function uploadMedia(file: File): Promise<Media> {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await api.post<{ status: string; data: Media }>('/api/v1/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export async function deleteMedia(id: string): Promise<void> {
  await api.delete(`/api/v1/media/${id}`);
}
