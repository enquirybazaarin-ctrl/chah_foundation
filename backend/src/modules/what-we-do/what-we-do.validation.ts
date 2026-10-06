import { z } from 'zod';

export const createWhatWeDoCardSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    badge: z.string().max(100).optional(),
    icon_type: z.enum(['essentials', 'health', 'kids', 'animals']).default('essentials'),
    accent_color: z.string().max(20).optional().default('#53b34b'),
    description: z.string().min(1, 'Description is required'),
    images: z.array(z.string().url('Must be valid image URL')).min(1, 'At least 1 image is required'),
    cta_text: z.string().max(50).optional().default('Know More'),
    cta_link: z.string().max(255).optional().default('/about'),
    sort_order: z.number().int().optional().default(0),
    is_active: z.boolean().optional().default(true),
  }),
});

export const updateWhatWeDoCardSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid ID format'),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    badge: z.string().max(100).optional(),
    icon_type: z.enum(['essentials', 'health', 'kids', 'animals']).optional(),
    accent_color: z.string().max(20).optional(),
    description: z.string().min(1).optional(),
    images: z.array(z.string().url('Must be valid image URL')).min(1).optional(),
    cta_text: z.string().max(50).optional(),
    cta_link: z.string().max(255).optional(),
    sort_order: z.number().int().optional(),
    is_active: z.boolean().optional(),
  }),
});

export const toggleWhatWeDoCardSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid ID format'),
  }),
  body: z.object({
    is_active: z.boolean().optional(),
  }).optional(),
});

export const updateSectionSettingsSchema = z.object({
  body: z.object({
    badge: z.string().max(100).optional(),
    heading: z.string().max(255).optional(),
    subheading: z.string().max(1000).optional(),
  }),
});
