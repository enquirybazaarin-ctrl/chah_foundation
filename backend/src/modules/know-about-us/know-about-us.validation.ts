import { z } from 'zod';

export const updateKnowAboutUsSchema = z.object({
  body: z.object({
    badge: z.string().max(100).optional(),
    heading: z.string().max(255).optional(),
    heading_highlight: z.string().max(100).optional(),
    subheading: z.string().optional(),
    body: z.string().optional(),
    quote: z.string().optional(),
    primary_button_text: z.string().max(100).optional(),
    primary_button_url: z.string().max(255).optional(),
    secondary_button_text: z.string().max(100).optional(),
    secondary_button_url: z.string().max(255).optional(),
    images: z.array(z.string().min(1)).optional(),
  }),
});

export const addImageSchema = z.object({
  body: z.object({
    image_url: z.string().min(1, 'Image URL is required'),
  }),
});

export const deleteImageSchema = z.object({
  body: z.object({
    index: z.number().int().min(0, 'Invalid image index'),
  }),
});
