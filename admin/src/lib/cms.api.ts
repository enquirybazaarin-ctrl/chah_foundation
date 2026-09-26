/**
 * CMS API Service
 * All admin blog/CMS-related API calls are centralised here.
 * NOTE: The backend wraps blog responses as:
 *   GET /blogs  → { status, data: { blogs, meta } }
 *   GET /blogs/:id → { status, data: { blog } }
 *   POST/PATCH  → { status, data: { blog } }
 *   GET /categories → { status, data: { categories } }
 *   GET /tags   → { status, data: { tags } }
 */
import api from './api';
import type {
  Blog,
  BlogCategory,
  BlogTag,
  BlogQueryParams,
  CreateBlogPayload,
  UpdateBlogPayload,
} from './types';

// ─── Response envelope shapes ──────────────────────────────────────────────

interface BlogListResponse {
  status: string;
  data: {
    blogs: Blog[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  };
}

interface BlogDetailResponse {
  status: string;
  data: { blog: Blog };
}

interface CategoriesResponse {
  status: string;
  data: { categories: BlogCategory[] };
}

interface TagsResponse {
  status: string;
  data: { tags: BlogTag[] };
}

// ─── Blogs ────────────────────────────────────────────────────────────────────

/**
 * Fetch paginated list of blogs (admin view — all statuses visible).
 */
export async function getBlogs(params: BlogQueryParams = {}): Promise<{
  blogs: Blog[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}> {
  const res = await api.get<BlogListResponse>('/api/v1/cms/blogs', { params });
  return res.data.data;
}

/**
 * Fetch a single blog by ID (includes full content).
 */
export async function getBlogById(id: string): Promise<Blog> {
  const res = await api.get<BlogDetailResponse>(`/api/v1/cms/blogs/${id}`);
  return res.data.data.blog;
}

/**
 * Create a new blog post.
 */
export async function createBlog(payload: CreateBlogPayload): Promise<Blog> {
  const res = await api.post<BlogDetailResponse>('/api/v1/cms/blogs', payload);
  return res.data.data.blog;
}

/**
 * Update an existing blog post.
 */
export async function updateBlog(id: string, payload: UpdateBlogPayload): Promise<Blog> {
  const res = await api.patch<BlogDetailResponse>(`/api/v1/cms/blogs/${id}`, payload);
  return res.data.data.blog;
}

/**
 * Archive a blog post (sets status to ARCHIVED).
 * Backend endpoint: PATCH /blogs/:id/status — no body required.
 */
export async function archiveBlog(id: string): Promise<Blog> {
  const res = await api.patch<BlogDetailResponse>(`/api/v1/cms/blogs/${id}/status`);
  return res.data.data.blog;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const res = await api.get<CategoriesResponse>('/api/v1/cms/categories');
  return res.data.data.categories;
}

export async function createBlogCategory(name: string): Promise<BlogCategory> {
  const res = await api.post<{ status: string; data: { category: BlogCategory } }>(
    '/api/v1/cms/categories',
    { name }
  );
  return res.data.data.category;
}

export async function deleteBlogCategory(id: number): Promise<void> {
  await api.delete(`/api/v1/cms/categories/${id}`);
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export async function getBlogTags(): Promise<BlogTag[]> {
  const res = await api.get<TagsResponse>('/api/v1/cms/tags');
  return res.data.data.tags;
}

export async function createBlogTag(name: string): Promise<BlogTag> {
  const res = await api.post<{ status: string; data: { tag: BlogTag } }>(
    '/api/v1/cms/tags',
    { name }
  );
  return res.data.data.tag;
}

export async function deleteBlogTag(id: number): Promise<void> {
  await api.delete(`/api/v1/cms/tags/${id}`);
}
