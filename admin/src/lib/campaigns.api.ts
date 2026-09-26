/**
 * Campaigns API Service
 * All admin campaign-related API calls are centralised here.
 */
import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Campaign,
  CampaignCategory,
  CampaignQueryParams,
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from './types';

// ─── Campaigns ────────────────────────────────────────────────────────────────

/**
 * Fetch all campaigns (admin view — all statuses).
 */
export async function getCampaignsAdmin(
  params: CampaignQueryParams = {}
): Promise<PaginatedResponse<Campaign>> {
  const res = await api.get<{ success: boolean; data: Campaign[]; meta: { total: number; page: number; limit: number } }>(
    '/api/v1/campaigns/admin',
    { params }
  );
  const { data, meta } = res.data;
  return {
    data,
    meta: {
      total: meta.total,
      page: meta.page,
      limit: meta.limit,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
}

/**
 * Fetch a single campaign by ID (includes full content field).
 */
export async function getCampaignById(id: string): Promise<Campaign> {
  const res = await api.get<ApiResponse<Campaign>>(`/api/v1/campaigns/${id}`);
  return res.data.data;
}

/**
 * Create a new campaign.
 */
export async function createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
  const res = await api.post<ApiResponse<Campaign>>('/api/v1/campaigns', payload);
  return res.data.data;
}

/**
 * Update an existing campaign.
 */
export async function updateCampaign(id: string, payload: UpdateCampaignPayload): Promise<Campaign> {
  const res = await api.patch<ApiResponse<Campaign>>(`/api/v1/campaigns/${id}`, payload);
  return res.data.data;
}

/**
 * Cancel a campaign (sets status to CANCELLED).
 */
export async function cancelCampaign(id: string): Promise<Campaign> {
  const res = await api.patch<ApiResponse<Campaign>>(`/api/v1/campaigns/${id}/status`);
  return res.data.data;
}

// ─── Campaign Categories ──────────────────────────────────────────────────────

/**
 * Fetch all campaign categories (public endpoint, no auth required).
 */
export async function getCampaignCategories(): Promise<CampaignCategory[]> {
  const res = await api.get<{ success: boolean; data: CampaignCategory[] }>(
    '/api/v1/campaign-categories'
  );
  return res.data.data;
}
