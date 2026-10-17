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
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch campaigns');
  return data.data;
}

export async function getCampaignBySlug(slug: string) {
  const res = await fetch(`${API_URL}/api/v1/campaigns/slug/${slug}`, {
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch campaign by slug');
  return data.data;
}

export async function getCampaignById(id: string) {
  const res = await fetch(`${API_URL}/api/v1/campaigns/id/${id}`, {
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch campaign by ID');
  return data.data;
}

export async function getCampaignSupporters(campaignId: string, limit = 10) {
  const res = await fetch(`${API_URL}/api/v1/campaigns/${campaignId}/supporters?limit=${limit}`, {
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch supporters');
  return data.data;
}

export async function getHeroSlides() {
  const res = await fetch(`${API_URL}/api/v1/hero-slides`, {
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch hero slides');
  return data.data.slides;
}

export async function getWhatWeDoData() {
  const res = await fetch(`${API_URL}/api/v1/what-we-do`, {
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch What We Do data');
  return data.data; // { cards: WhatWeDoItem[], section: { badge, heading, subheading } }
}

export interface KnowAboutUsData {
  badge: string;
  heading: string;
  heading_highlight: string;
  subheading: string;
  body: string;
  quote: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  images: string[];
}

export async function getKnowAboutUsData(): Promise<KnowAboutUsData> {
  const res = await fetch(`${API_URL}/api/v1/know-about-us`, {
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch Know About Us data');
  return data.data;
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
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch featured campaign section');
  return data.data;
}

export async function getMedicalEmergencySection(): Promise<FeaturedCampaignSectionData> {
  const res = await fetch(`${API_URL}/api/v1/campaigns/medical-section`, {
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch medical emergency section');
  return data.data;
}

export async function getEldercareSection(): Promise<FeaturedCampaignSectionData> {
  const res = await fetch(`${API_URL}/api/v1/campaigns/eldercare-section`, {
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch eldercare section');
  return data.data;
}

export async function getFoodSection(): Promise<FeaturedCampaignSectionData> {
  const res = await fetch(`${API_URL}/api/v1/campaigns/food-section`, {
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch food section');
  return data.data;
}

export interface ProjectGalleryImageItem {
  id: string;
  url: string | null;
  caption?: string | null;
  alt_text?: string | null;
}

export interface ProjectActivityItem {
  id: string;
  title: string;
  description?: string | null;
  date?: string | null;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  short_description: string | null;
  category: string | null;
  location: string | null;
  project_date: string | null;
  impact_summary: string | null;
  beneficiary_info: string | null;
  featured_image_url: string | null;
  status?: string;
  is_featured: boolean;
  cta_text: string | null;
  cta_link: string | null;
  start_date?: string | null;
  end_date?: string | null;
  gallery_images?: ProjectGalleryImageItem[];
  activities?: ProjectActivityItem[];
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
  const res = await fetch(`${API_URL}/api/v1/projects/impact-section`, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch Impact Projects section');
  return data.data;
}

export async function getProjects(page = 1, limit = 50): Promise<ProjectItem[]> {
  const res = await fetch(`${API_URL}/api/v1/projects?page=${page}&limit=${limit}`, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch projects');
  return data.data?.projects || [];
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/projects/slug/${encodeURIComponent(slug)}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.project || null;
  } catch {
    return null;
  }
}

export interface PartnershipEnquiryInput {
  name: string;
  organisation: string;
  email: string;
  phone?: string;
  partnershipType: string;
  areaOfInterest: string;
  message: string;
}

export async function submitPartnershipEnquiry(input: PartnershipEnquiryInput): Promise<{ success: boolean; message?: string }> {
  const subject = `Partnership Enquiry: ${input.partnershipType} - ${input.organisation}`;
  const message = `Organisation: ${input.organisation}\nPartnership Type: ${input.partnershipType}\nArea of Interest: ${input.areaOfInterest}\n\nMessage:\n${input.message}`;

  const res = await fetch(`${API_URL}/api/v1/operations/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone || undefined,
      subject,
      message,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit partnership enquiry. Please check your information and try again.');
  }

  return { success: true };
}

export async function subscribeNewsletter(email: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${API_URL}/api/v1/operations/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to subscribe. Please try again.');
  }

  return { success: true, message: data.message || 'Subscribed successfully!' };
}

export interface DonationImpactCard {
  id: string;
  amount: number;
  title: string;
  short_description: string;
  impact_note?: string;
  image_url: string;
  badge?: string;
}

export const DEFAULT_DONATION_CARDS: DonationImpactCard[] = [
  {
    id: "card_500",
    amount: 500,
    title: "Feed a Child",
    short_description: "Help provide nutritious meals to children.",
    impact_note: "Contributes towards wholesome, balanced daily meals for children attending community welfare centres.",
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
    badge: "Nutrition Support"
  },
  {
    id: "card_1000",
    amount: 1000,
    title: "Support Healthcare",
    short_description: "Help families access essential medical support.",
    impact_note: "Supports essential clinical checkups, basic diagnostic tests, and urgent medical relief for families.",
    image_url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
    badge: "Medical Aid"
  },
  {
    id: "card_2000",
    amount: 2000,
    title: "Educate a Child",
    short_description: "Help children access learning materials and school supplies.",
    impact_note: "Provides books, school kits, and remedial tutoring support to keep vulnerable children in formal education.",
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    badge: "Education First"
  },
  {
    id: "card_5000",
    amount: 5000,
    title: "Empower a Community",
    short_description: "Support community health and sanitation initiatives.",
    impact_note: "Assists community sanitation, clean drinking water access, and hygiene awareness for underprivileged settlements.",
    image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop",
    badge: "Community Impact"
  }
];

export async function getDonationCardsSettings(): Promise<DonationImpactCard[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/operations/settings/public`, {
      cache: 'no-store'
    });
    if (!res.ok) return DEFAULT_DONATION_CARDS;
    const data = await res.json();
    const setting = data.data?.settings?.find((s: any) => s.setting_key === 'DONATION_IMPACT_CARDS');
    if (setting?.setting_value) {
      const parsed = JSON.parse(setting.setting_value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    return DEFAULT_DONATION_CARDS;
  } catch {
    return DEFAULT_DONATION_CARDS;
  }
}

export interface VolunteerLeadInput {
  name: string;
  email: string;
  phone: string;
  city?: string;
  areaOfInterest?: string;
  message?: string;
}

export async function submitVolunteerLead(input: VolunteerLeadInput): Promise<{ success: boolean; message?: string }> {
  const subject = `Volunteer Lead: ${input.name} - ${input.areaOfInterest || 'General Volunteering'}`;
  const messageLines = [
    `NEW VOLUNTEER REGISTRATION`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    input.city ? `City / State: ${input.city}` : null,
    input.areaOfInterest ? `Area of Interest: ${input.areaOfInterest}` : null,
    `\nSkills / Availability / Note:`,
    input.message || 'No additional note provided.',
  ];

  const res = await fetch(`${API_URL}/api/v1/operations/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone || undefined,
      subject,
      message: messageLines.filter(Boolean).join('\n'),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit volunteer application. Please check your information and try again.');
  }

  return { success: true };
}
