import { z } from 'zod';

export const createTestimonialSchema = z.object({
  body: z.object({
    author_name: z.string().min(1, 'Author name is required').max(255, 'Author name is too long'),
    author_role: z.string().max(255, 'Author role is too long').optional().nullable(),
    content: z.string().min(1, 'Content is required').max(2000, 'Content is too long'),
    avatar_image_id: z.number().int().positive().optional().nullable(),
    is_published: z.boolean().optional(),
  })
});

export const updateTestimonialSchema = z.object({
  body: z.object({
    author_name: z.string().min(1, 'Author name is required').max(255, 'Author name is too long').optional(),
    author_role: z.string().max(255, 'Author role is too long').optional().nullable(),
    content: z.string().min(1, 'Content is required').max(2000, 'Content is too long').optional(),
    avatar_image_id: z.number().int().positive().optional().nullable(),
    is_published: z.boolean().optional(),
  })
});
