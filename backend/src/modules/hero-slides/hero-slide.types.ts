export interface CreateHeroSlideInput {
  tag?: string;
  title: string;
  highlight?: string;
  description?: string;
  image_url: string;
  media_id?: number | bigint;
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateHeroSlideInput {
  tag?: string;
  title?: string;
  highlight?: string;
  description?: string;
  image_url?: string;
  media_id?: number | bigint | null;
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  sort_order?: number;
  is_active?: boolean;
}
