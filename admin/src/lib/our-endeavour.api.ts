import { fetchApi } from './api';
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
  const data = await fetchApi('/api/v1/metrics/section');
  return data;
}

export async function updateOurEndeavourSettings(settings: any): Promise<any> {
  const data = await fetchApi('/api/v1/metrics/section', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  });
  return data.section;
}

export async function createMetric(payload: any): Promise<MetricItem> {
  const data = await fetchApi('/api/v1/metrics', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.metric;
}

export async function updateMetric(id: string, payload: any): Promise<MetricItem> {
  const data = await fetchApi(`/api/v1/metrics/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.metric;
}

export async function deleteMetric(id: string): Promise<void> {
  await fetchApi(`/api/v1/metrics/${id}`, {
    method: 'DELETE',
  });
}
