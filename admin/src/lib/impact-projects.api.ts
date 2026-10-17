import api from './api';

export interface ImpactSectionSettings {
  badge: string;
  heading: string;
  subheading: string;
}

export async function getImpactSectionAdmin(): Promise<any> {
  const res = await api.get('/api/v1/projects/impact-section');
  return res.data.data || res.data;
}

export async function updateImpactSectionSettings(settings: ImpactSectionSettings): Promise<ImpactSectionSettings> {
  const res = await api.patch('/api/v1/projects/impact-section', settings);
  return res.data.data?.section || res.data.section;
}
