export interface KnowAboutUsData {
  badge: string;
  heading: string;
  heading_highlight: string;
  subheading: string;
  body: string;
  quote: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  images: string[];
}

export interface UpdateKnowAboutUsInput {
  badge?: string;
  heading?: string;
  heading_highlight?: string;
  subheading?: string;
  body?: string;
  quote?: string;
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  images?: string[];
}
