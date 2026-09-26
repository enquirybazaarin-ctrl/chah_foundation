export interface CreateBlogCategoryInput {
  name: string;
}

export interface UpdateBlogCategoryInput {
  name?: string;
}

export interface CreateTagInput {
  name: string;
}

export interface UpdateTagInput {
  name?: string;
}

export interface CreateBlogInput {
  title: string;
  category_id: number;
  excerpt?: string;
  content: string;
  featured_image_id?: number;
  status?: string; // DRAFT | PUBLISHED | ARCHIVED
  tag_ids?: number[];
}

export interface UpdateBlogInput {
  title?: string;
  category_id?: number;
  excerpt?: string;
  content?: string;
  featured_image_id?: number;
  status?: string;
  tag_ids?: number[];
}

export interface BlogQueryOptions {
  page?: number;
  limit?: number;
  status?: string;
  category_id?: number;
  tag_id?: number;
}
