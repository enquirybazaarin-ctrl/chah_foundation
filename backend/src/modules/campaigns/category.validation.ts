import { z } from 'zod';

export const createCampaignCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    description: z.string().max(500).optional(),
  })
});

export const updateCampaignCategorySchema = createCampaignCategorySchema.partial();
