export interface CreateWhatWeDoCardInput {
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

export interface UpdateWhatWeDoCardInput {
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

export interface SectionSettingsInput {
  badge?: string;
  heading?: string;
  subheading?: string;
}
