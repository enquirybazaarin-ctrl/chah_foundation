export interface CreateCampaignCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCampaignCategoryDTO {
  name?: string;
  description?: string;
}

export interface CampaignCategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}
