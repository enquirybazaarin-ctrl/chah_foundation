import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
    slug: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    short_description: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    beneficiary_info: z.string().optional().nullable(),
    impact_summary: z.string().optional().nullable(),
    gallery_media_ids: z.array(z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)])).optional().nullable(),
    status: z.string().optional().nullable(),
    is_published: z.boolean().optional().nullable(),
    is_featured: z.boolean().optional().nullable(),
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
    featured_image_id: z.union([z.number().int().positive(), z.string().regex(/^\d+$/).transform(Number)]).optional().nullable(),
  })
}).refine(data => {
  if (data.body.start_date && data.body.end_date) {
    return new Date(data.body.end_date) >= new Date(data.body.start_date);
  }
  return true;
}, {
  message: 'End date must be after or equal to start date',
  path: ['body', 'end_date']
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long').optional(),
    slug: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    short_description: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    beneficiary_info: z.string().optional().nullable(),
    impact_summary: z.string().optional().nullable(),
    gallery_media_ids: z.array(z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)])).optional().nullable(),
    status: z.string().optional().nullable(),
    is_published: z.boolean().optional().nullable(),
    is_featured: z.boolean().optional().nullable(),
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
    featured_image_id: z.union([z.number().int().positive(), z.string().regex(/^\d+$/).transform(Number)]).optional().nullable(),
  })
}).refine(data => {
  if (data.body.start_date && data.body.end_date) {
    return new Date(data.body.end_date) >= new Date(data.body.start_date);
  }
  return true;
}, {
  message: 'End date must be after or equal to start date',
  path: ['body', 'end_date']
});

export const projectQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  })
});

export const createActivitySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
    date: z.string().datetime().optional().nullable(),
    description: z.string().optional().nullable(),
  })
});

export const updateActivitySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long').optional(),
    date: z.string().datetime().optional().nullable(),
    description: z.string().optional().nullable(),
  })
});
