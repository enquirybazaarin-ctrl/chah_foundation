import api from './api';

export interface Subscription {
  id: string;
  subscription_number: string;
  donor_id: string;
  campaign_id: string | null;
  amount: string;
  currency: string;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'COMPLETED';
  next_billing_date: string | null;
  created_at: string;
  updated_at: string;
  donor: {
    first_name: string;
    last_name: string | null;
    email: string | null;
  };
  campaign?: {
    title: string;
  };
}

export interface PaginatedSubscriptions {
  data: Subscription[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getSubscriptions(params: { page?: number; limit?: number; status?: string } = {}): Promise<PaginatedSubscriptions> {
  const res = await api.get<{ status: string; data: { subscriptions: Subscription[]; meta: any } }>(
    '/api/v1/subscriptions',
    { params }
  );
  
  const { subscriptions, meta } = res.data.data;
  return {
    data: subscriptions,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit)
    }
  };
}

export async function updateSubscriptionStatus(id: string, status: string): Promise<Subscription> {
  const res = await api.patch<{ status: string; data: { subscription: Subscription } }>(
    `/api/v1/subscriptions/${id}/status`,
    { status }
  );
  return res.data.data.subscription;
}
