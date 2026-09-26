import { z } from 'zod';

export const createBlogCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  })
});

export const updateBlogCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long').optional(),
  })
});

export const createTagSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  })
});

export const updateTagSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long').optional(),
  })
});

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
    category_id: z.number().int().positive(),
    excerpt: z.string().max(1000, 'Excerpt is too long').optional().nullable(),
    content: z.string().min(1, 'Content is required'),
    featured_image_id: z.number().int().positive().optional().nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    tag_ids: z.array(z.number().int().positive()).optional(),
  })
});

export const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long').optional(),
    category_id: z.number().int().positive().optional(),
    excerpt: z.string().max(1000, 'Excerpt is too long').optional().nullable(),
    content: z.string().min(1, 'Content is required').optional(),
    featured_image_id: z.number().int().positive().optional().nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    tag_ids: z.array(z.number().int().positive()).optional(),
  })
});

export const blogQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    category_id: z.string().regex(/^\d+$/).transform(Number).optional(),
    tag_id: z.string().regex(/^\d+$/).transform(Number).optional(),
  })
});
