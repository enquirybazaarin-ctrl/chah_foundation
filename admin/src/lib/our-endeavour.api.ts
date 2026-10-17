import api from './api';

export interface MetricItem {
  id: string;
  metric_name: string;
  metric_value: string;
  icon: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OurEndeavourSectionSettings {
  badge: string;
  heading: string;
  description: string;
  cta_text: string;
  cta_link: string;
  updated_as_on: string;
}

export interface OurEndeavourSectionData {
  section: OurEndeavourSectionSettings;
  metrics: MetricItem[];
}

// Admin API routes for Our Endeavour Section

export async function getOurEndeavourAdmin(): Promise<OurEndeavourSectionData> {
  const res = await api.get('/api/v1/metrics/section');
  return res.data.data || res.data;
}

export async function updateOurEndeavourSettings(settings: any): Promise<any> {
  const res = await api.patch('/api/v1/metrics/section', settings);
  return res.data.data?.section || res.data.section;
}

export async function createMetric(payload: any): Promise<MetricItem> {
  const res = await api.post('/api/v1/metrics', payload);
  return res.data.data?.metric || res.data.metric;
}

export async function updateMetric(id: string, payload: any): Promise<MetricItem> {
  const res = await api.patch(`/api/v1/metrics/${id}`, payload);
  return res.data.data?.metric || res.data.metric;
}

export async function deleteMetric(id: string): Promise<void> {
  await api.delete(`/api/v1/metrics/${id}`);
}
