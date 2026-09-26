export interface CreateProjectInput {
  title: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  featured_image_id?: number;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
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
