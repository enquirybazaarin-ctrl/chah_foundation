import { fetchApi } from './api';

export interface ImpactSectionSettings {
  badge: string;
  heading: string;
  subheading: string;
}

export async function getImpactSectionAdmin(): Promise<any> {
  const data = await fetchApi('/api/v1/projects/impact-section');
  return data;
}

export async function updateImpactSectionSettings(settings: ImpactSectionSettings): Promise<ImpactSectionSettings> {
  const data = await fetchApi('/api/v1/projects/impact-section', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  });
  return data.section;
}
