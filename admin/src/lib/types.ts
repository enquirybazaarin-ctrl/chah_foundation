/**
 * Shared type definitions for the Admin Dashboard.
 * These mirror the backend API response shapes.
 */

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

// ─── Donor ────────────────────────────────────────────────────────────────────

export interface Donor {
  id: string;
  donor_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  pan_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  is_anonymous: boolean;
  total_donated: string; // DECIMAL returned as string from JSON
  created_at: string;
  updated_at: string;
}

// ─── Donation ─────────────────────────────────────────────────────────────────

export type DonationStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 'ONLINE' | 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'OTHER';

export interface Donation {
  id: string;
  donation_number: string;
  donor_id: string;
  amount: string; // DECIMAL returned as string
  currency: string;
  status: DonationStatus;
  payment_method: PaymentMethod;
  is_anonymous: boolean;
  campaign_id: string | null;
  notes: string | null;
  certificate_issued: boolean;
  certificate_email_sent: boolean;
  created_at: string;
  updated_at: string;
  donor?: Pick<Donor, 'id' | 'donor_number' | 'first_name' | 'last_name' | 'email'>;
  campaign?: { id: string; title: string } | null;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface DonorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DonationQueryParams {
  page?: number;
  limit?: number;
  donor_id?: string;
  status?: DonationStatus | '';
  payment_method?: PaymentMethod | '';
}

// ─── Campaign ─────────────────────────────────────────────────────────────────

export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface CampaignCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  beneficiary_name?: string | null;
  beneficiary_age?: number | null;
  location?: string | null;
  target_amount: string | null; // DECIMAL as string
  raised_amount: string;         // DECIMAL as string
  status: CampaignStatus;
  start_date: string | null;
  end_date: string | null;
  content?: string;              // Omitted in list responses, present in detail
  featured_image_id: string | null;
  featured_image_url?: string | null;
  is_featured: boolean;
  is_urgent: boolean;
  urgency_label?: string | null;
  cta_button_text?: string | null;
  sort_order: number;
  supporters_count: number;
  created_at: string;
  updated_at: string;
  category?: CampaignCategory;
  featured_image?: Media | null;
}

export interface CreateCampaignPayload {
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

export interface UpdateCampaignPayload {
  title?: string;
  category_id?: string;
  short_description?: string | null;
  beneficiary_name?: string | null;
  beneficiary_age?: number | null;
  location?: string | null;
  target_amount?: number | null;
  raised_amount?: number;
  start_date?: string | null;
  end_date?: string | null;
  content?: string;
  featured_image_id?: string | null;
  featured_image_url?: string | null;
  is_featured?: boolean;
  is_urgent?: boolean;
  urgency_label?: string | null;
  cta_button_text?: string;
  sort_order?: number;
  supporters_count?: number;
}

export interface FeaturedCampaignSectionSettings {
  badge: string;
  heading: string;
  subheading: string;
}

export interface FeaturedCampaignSectionResponse {
  featured: Campaign | null;
  supporting: Campaign[];
  section: FeaturedCampaignSectionSettings;
}

export interface CampaignQueryParams {
  page?: number;
  limit?: number;
}

// ─── CMS / Blog ──────────────────────────────────────────────────────────────

export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;         // BigInt serialised as string
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;   // Omitted in list responses
  status: BlogStatus;
  category_id: number;
  author_id: string;
  featured_image_id: number | null;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
  tags?: BlogTag[];
  author?: { id: string; first_name: string; last_name: string };
}

export interface CreateBlogPayload {
  title: string;
  category_id: number;
  excerpt?: string;
  content: string;
  status?: BlogStatus;
  tag_ids?: number[];
}

export interface UpdateBlogPayload {
  title?: string;
  category_id?: number;
  excerpt?: string | null;
  content?: string;
  status?: BlogStatus;
  tag_ids?: number[];
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  status?: BlogStatus;
  category_id?: number;
}

// ─── Projects ─────────────────────────────────────────────────────────────

export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';

export interface ProjectActivity {
  id: string; // BigInt serialized as string
  project_id: string;
  title: string;
  date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string; // BigInt serialized as string
  title: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  featured_image_id: string | null;
  created_at: string;
  updated_at: string;
  activities?: ProjectActivity[];
}

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
}

export interface CreateProjectPayload {
  title: string;
  slug?: string;
  description?: string;
  status?: ProjectStatus;
  start_date?: string;
  end_date?: string;
}

export interface UpdateProjectPayload {
  title?: string;
  slug?: string;
  description?: string | null;
  status?: ProjectStatus;
  start_date?: string | null;
  end_date?: string | null;
}

export interface CreateProjectActivityPayload {
  title: string;
  description?: string;
  date?: string;
}

// ─── Settings ─────────────────────────────────────────────────────────────

export interface Setting {
  id: string;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
}

export interface UpsertSettingPayload {
  setting_key: string;
  setting_value: string;
}

// ─── Enquiries ────────────────────────────────────────────────────────────

export type EnquiryStatus = 'UNREAD' | 'READ' | 'RESOLVED';

export interface Enquiry {
  id: string; // BigInt
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
  updated_at: string;
}

export interface EnquiryQueryParams {
  page?: number;
  limit?: number;
  status?: EnquiryStatus;
}

// ─── Media ───────────────────────────────────────────────────────────────

export interface Media {
  id: string; // BigInt
  album_id: string | null;
  filename: string;
  url: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  album_id?: string;
}

// ─── Audit Logs ──────────────────────────────────────────────────────────

export interface AuditLog {
  id: string; // BigInt
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string; // BigInt
  old_values: any | null;
  new_values: any | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  entity_type?: string;
  action?: string;
}

// ─── Hero Slide ──────────────────────────────────────────────────────────

export interface HeroSlide {
  id: string;
  tag: string | null;
  title: string;
  highlight: string | null;
  description: string | null;
  image_url: string;
  media_id: string | null;
  primary_button_text: string | null;
  primary_button_url: string | null;
  secondary_button_text: string | null;
  secondary_button_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  media?: Media | null;
}

export interface CreateHeroSlidePayload {
  tag?: string;
  title: string;
  highlight?: string;
  description?: string;
  image_url: string;
  media_id?: string | number;
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateHeroSlidePayload {
  tag?: string;
  title?: string;
  highlight?: string;
  description?: string;
  image_url?: string;
  media_id?: string | number | null;
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  sort_order?: number;
  is_active?: boolean;
}

// ─── What We Do ──────────────────────────────────────────────────────────

export interface WhatWeDoSectionSettings {
  badge: string;
  heading: string;
  subheading: string;
}

export interface WhatWeDoCard {
  id: string;
  title: string;
  badge: string | null;
  icon_type: 'essentials' | 'health' | 'kids' | 'animals' | string;
  accent_color: string | null;
  description: string;
  images: string[];
  cta_text: string | null;
  cta_link: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateWhatWeDoCardPayload {
  title: string;
  badge?: string;
  icon_type?: string;
  accent_color?: string;
  description: string;
  images: string[];
  cta_text?: string;
  cta_link?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateWhatWeDoCardPayload {
  title?: string;
  badge?: string;
  icon_type?: string;
  accent_color?: string;
  description?: string;
  images?: string[];
  cta_text?: string;
  cta_link?: string;
  sort_order?: number;
  is_active?: boolean;
}
