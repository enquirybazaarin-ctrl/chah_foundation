const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function createOnlineDonation(payload: any, idempotencyKey: string) {
  const res = await fetch(`${API_URL}/api/v1/donations/online`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create donation');
  return data.data;
}

export async function verifyOnlineDonation(payload: any) {
  const res = await fetch(`${API_URL}/api/v1/donations/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to verify donation');
  return data.data;
}

export async function getCampaigns(page = 1, limit = 10) {
  const res = await fetch(`${API_URL}/api/v1/campaigns?page=${page}&limit=${limit}`, {
    next: { revalidate: 60 }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch campaigns');
  return data.data;
}

export async function getHeroSlides() {
  const res = await fetch(`${API_URL}/api/v1/hero-slides`, {
    next: { revalidate: 60 }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch hero slides');
  return data.data.slides;
}

export async function getWhatWeDoData() {
  const res = await fetch(`${API_URL}/api/v1/what-we-do`, {
    next: { revalidate: 60 }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch What We Do data');
  return data.data; // { cards: WhatWeDoItem[], section: { badge, heading, subheading } }
}

export interface MetricItem {
  id: string;
  metric_name: string;
  metric_value: string;
  icon?: string | null;
}

export interface OurEndeavourSectionData {
  section: {
    badge: string;
    heading: string;
    description: string;
    cta_text: string;
    cta_link: string;
    updated_as_on: string;
  };
  metrics: MetricItem[];
}

export async function getOurEndeavourData(): Promise<OurEndeavourSectionData> {
  const res = await fetch(`${API_URL}/api/v1/metrics/section`, {
    next: { revalidate: 60 }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch Our Endeavour data');
  return data.data;
}

export interface FeaturedCampaignItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  beneficiary_name?: string | null;
  beneficiary_age?: number | null;
  location?: string | null;
  target_amount: string | null;
  raised_amount: string;
  supporters_count: number;
  featured_image_url?: string | null;
  featured_image?: {
    id: string;
    url: string;
  } | null;
  is_featured: boolean;
  is_urgent: boolean;
  urgency_label?: string | null;
  cta_button_text?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface FeaturedCampaignSectionData {
  featured: FeaturedCampaignItem | null;
  supporting: FeaturedCampaignItem[];
  section: {
    badge: string;
    heading: string;
    subheading: string;
  };
}

export async function getFeaturedCampaignSection(): Promise<FeaturedCampaignSectionData> {
  const res = await fetch(`${API_URL}/api/v1/campaigns/featured-section`, {
    next: { revalidate: 60 }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch featured campaign section');
  return data.data;
}

export async function getMedicalEmergencySection(): Promise<FeaturedCampaignSectionData> {
  const res = await fetch(`${API_URL}/api/v1/campaigns/medical-section`, {
    next: { revalidate: 60 }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch medical emergency section');
  return data.data;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  short_description: string | null;
  location: string | null;
  project_date: string | null;
  impact_summary: string | null;
  beneficiary_info: string | null;
  featured_image_url: string | null;
  is_featured: boolean;
  cta_text: string | null;
  cta_link: string | null;
}

export interface ImpactProjectsSectionData {
  featured: ProjectItem | null;
  supporting: ProjectItem[];
  section: {
    badge: string;
    heading: string;
    subheading: string;
  };
}

export async function getImpactProjectsSection(): Promise<ImpactProjectsSectionData> {
  const res = await fetch(`${API_URL}/api/v1/projects/impact-section`, { next: { revalidate: 60 } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch Impact Projects section');
  return data.data;
}
