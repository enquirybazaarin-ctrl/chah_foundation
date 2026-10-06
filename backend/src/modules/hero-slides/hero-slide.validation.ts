import { z } from 'zod';

export const createHeroSlideSchema = z.object({
  body: z.object({
    tag: z.string().max(255).optional(),
    title: z.string().min(1, 'Title is required').max(255),
    highlight: z.string().max(255).optional(),
    description: z.string().optional(),
    image_url: z.string().url('Invalid image URL').min(1, 'Image URL is required'),
    media_id: z.union([z.number(), z.string()]).transform(val => BigInt(val)).optional(),
    primary_button_text: z.string().max(100).optional(),
    primary_button_url: z.string().max(255).optional(),
    secondary_button_text: z.string().max(100).optional(),
    secondary_button_url: z.string().max(255).optional(),
    sort_order: z.number().int().optional(),
    is_active: z.boolean().optional(),
  })
});

export const updateHeroSlideSchema = z.object({
  body: z.object({
    tag: z.string().max(255).optional(),
    title: z.string().min(1, 'Title cannot be empty').max(255).optional(),
    highlight: z.string().max(255).optional(),
    description: z.string().optional(),
    image_url: z.string().url('Invalid image URL').optional(),
    media_id: z.union([z.number(), z.string()]).transform(val => BigInt(val)).nullable().optional(),
    primary_button_text: z.string().max(100).optional(),
    primary_button_url: z.string().max(255).optional(),
    secondary_button_text: z.string().max(100).optional(),
    secondary_button_url: z.string().max(255).optional(),
    sort_order: z.number().int().optional(),
    is_active: z.boolean().optional(),
  })
});

export const toggleHeroSlideSchema = z.object({
  body: z.object({
    is_active: z.boolean().optional(),
  }).optional()
});
