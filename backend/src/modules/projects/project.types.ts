export interface CreateProjectInput {
  title: string;
  slug?: string;
  description?: string;
  short_description?: string;
  category?: string;
  location?: string;
  beneficiary_info?: string;
  impact_summary?: string;
  gallery_media_ids?: number[];
  status?: string;
  is_published?: boolean;
  is_featured?: boolean;
  start_date?: string;
  end_date?: string;
  featured_image_id?: number;
}

export interface UpdateProjectInput {
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  category?: string;
  location?: string;
  beneficiary_info?: string;
  impact_summary?: string;
  gallery_media_ids?: number[];
  status?: string;
  is_published?: boolean;
  is_featured?: boolean;
  start_date?: string;
  end_date?: string;
  featured_image_id?: number;
}

export interface CreateActivityInput {
  title: string;
  date?: string;
  description?: string;
}

export interface UpdateActivityInput {
  title?: string;
  date?: string;
  description?: string;
}

export interface ProjectQueryOptions {
  page?: number;
  limit?: number;
  status?: string;
}
