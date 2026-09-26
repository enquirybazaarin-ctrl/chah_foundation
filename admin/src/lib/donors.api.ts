/**
 * Donor API Service
 * All admin donor-related API calls are centralised here.
 */
import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Donor,
  Donation,
  DonorQueryParams,
  DonationQueryParams,
} from './types';

/**
 * Fetch a paginated list of donors.
 * Requires: read:donors permission (enforced by backend).
 */
export async function getDonors(
  params: DonorQueryParams = {}
): Promise<PaginatedResponse<Donor>> {
  const res = await api.get<{ status: string; data: Donor[]; meta: any }>(
    '/api/v1/donors',
    { params }
  );
  const { data, meta } = res.data;
  return {
    data,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
}

/**
 * Fetch a single donor by ID.
 */
export async function getDonorById(id: string): Promise<Donor> {
  const res = await api.get<ApiResponse<Donor>>(`/api/v1/donors/${id}`);
  return res.data.data;
}

/**
 * Fetch all donations for a specific donor.
 */
export async function getDonorDonations(
  donorId: string,
  params: DonationQueryParams = {}
): Promise<PaginatedResponse<Donation>> {
  const res = await api.get<{ status: string; data: Donation[]; meta: any }>(
    `/api/v1/donors/${donorId}/donations`,
    { params }
  );
  const { data, meta } = res.data;
  return {
    data,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
}

/**
 * Fetch a paginated list of all donations (master ledger).
 */
export async function getDonations(
  params: DonationQueryParams = {}
): Promise<PaginatedResponse<Donation>> {
  const res = await api.get<{ status: string; data: Donation[]; meta: any }>(
    '/api/v1/donations',
    { params }
  );
  const { data, meta } = res.data;
  return {
    data,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
}

/**
 * Fetch a single donation by ID.
 */
export async function getDonationById(id: string): Promise<Donation> {
  const res = await api.get<ApiResponse<Donation>>(`/api/v1/donations/${id}`);
  return res.data.data;
}

/**
 * Create an offline donation
 */
export async function createOfflineDonation(payload: any): Promise<Donation> {
  const res = await api.post<ApiResponse<Donation>>('/api/v1/donations/offline', payload);
  return res.data.data;
}

export async function getDuplicateSuggestions(page = 1, limit = 20): Promise<any> {
  const res = await api.get<{ status: string; data: any[]; meta: any }>(
    '/api/v1/donors/duplicates',
    { params: { page, limit } }
  );
  const { data, meta } = res.data;
  return {
    data,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
}

export async function resolveDuplicateSuggestion(id: string, action: 'merge' | 'ignore'): Promise<any> {
  const res = await api.post<{ status: string; data: any }>(
    `/api/v1/donors/duplicates/${id}/resolve`,
    { action }
  );
  return res.data.data;
}
