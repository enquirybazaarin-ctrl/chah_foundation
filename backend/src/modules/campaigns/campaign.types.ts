export interface CreateCampaignDTO {
  title: string;
  category_id: string;
  short_description?: string;
  beneficiary_name?: string;
  beneficiary_age?: number;
  location?: string;
  target_amount?: number;
  raised_amount?: number;
  start_date?: string;
  end_date?: string;
  content: string;
  featured_image_id?: string;
  featured_image_url?: string;
  is_featured?: boolean;
  is_urgent?: boolean;
  urgency_label?: string;
  cta_button_text?: string;
  sort_order?: number;
  supporters_count?: number;
}

export interface UpdateCampaignDTO {
  title?: string;
  category_id?: string;
  short_description?: string;
  beneficiary_name?: string;
  beneficiary_age?: number;
  location?: string;
  target_amount?: number | null;
  raised_amount?: number;
  start_date?: string | null;
  end_date?: string | null;
  content?: string;
  featured_image_id?: string | null;
  featured_image_url?: string;
  is_featured?: boolean;
  is_urgent?: boolean;
  urgency_label?: string;
  cta_button_text?: string;
  sort_order?: number;
  supporters_count?: number;
}

export interface CampaignResponse {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  beneficiary_name?: string | null;
  beneficiary_age?: number | null;
  location?: string | null;
  target_amount: string | null;
  raised_amount: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  content?: string;
  featured_image_id: string | null;
  featured_image_url?: string | null;
  is_featured: boolean;
  is_urgent: boolean;
  urgency_label?: string | null;
  cta_button_text?: string | null;
  sort_order: number;
  supporters_count: number;
  created_at: Date;
  updated_at: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  featured_image?: {
    id: string;
    url: string;
    alt_text?: string | null;
  } | null;
}

export interface FeaturedCampaignSectionSettings {
  badge: string;
  heading: string;
  subheading: string;
}

export interface FeaturedSectionResponse {
  featured: CampaignResponse | null;
  supporting: CampaignResponse[];
  section: FeaturedCampaignSectionSettings;
}

export interface MedicalEmergencySectionSettings {
  badge: string;
  heading: string;
  subheading: string;
}

export interface MedicalEmergencySectionResponse {
  featured: CampaignResponse | null;
  supporting: CampaignResponse[];
  section: MedicalEmergencySectionSettings;
}
