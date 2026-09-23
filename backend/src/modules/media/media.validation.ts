import { z } from 'zod';

export const updateMediaSchema = z.object({
  body: z.object({
    album_id: z.number().int().positive().optional().nullable(),
    alt_text: z.string().max(255, 'Alt text must be at most 255 characters').optional().nullable(),
    caption: z.string().max(1000, 'Caption must be at most 1000 characters').optional().nullable(),
  })
});
