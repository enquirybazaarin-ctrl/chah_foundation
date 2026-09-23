export interface CreateCampaignDTO {
  title: string;
  category_id: string;
  target_amount?: number;
  start_date?: string;
  end_date?: string;
  content: string;
  featured_image_id?: string;
}

export interface UpdateCampaignDTO {
  title?: string;
  category_id?: string;
  target_amount?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  content?: string;
  featured_image_id?: string | null;
}

export interface CampaignResponse {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  target_amount: string | null;
  raised_amount: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  content?: string; // Sometimes omitted in lists
  featured_image_id: string | null;
  created_at: Date;
  updated_at: Date;
}
