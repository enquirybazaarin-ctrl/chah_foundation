import { z } from 'zod';

export const createAlbumSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
    description: z.string().max(500, 'Description must be at most 500 characters').optional().nullable(),
  })
});

export const updateAlbumSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').optional(),
    description: z.string().max(500, 'Description must be at most 500 characters').optional().nullable(),
  })
});
