import { z } from 'zod';

export const createCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255),
    category_id: z.string().regex(/^\d+$/),
    target_amount: z.number().positive().optional(),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
    content: z.string().min(1),
    featured_image_id: z.string().regex(/^\d+$/).optional(),
  }).refine(data => {
    if (data.start_date && data.end_date) {
      return new Date(data.end_date) > new Date(data.start_date);
    }
    return true;
  }, {
    message: "end_date must be greater than start_date",
    path: ["end_date"]
  })
});

export const updateCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255).optional(),
    category_id: z.string().regex(/^\d+$/).optional(),
    target_amount: z.number().positive().nullable().optional(),
    start_date: z.string().datetime().nullable().optional(),
    end_date: z.string().datetime().nullable().optional(),
    content: z.string().min(1).optional(),
    featured_image_id: z.string().regex(/^\d+$/).nullable().optional(),
  }).refine(data => {
    if (data.start_date && data.end_date) {
      return new Date(data.end_date) > new Date(data.start_date);
    }
    return true;
  }, {
    message: "end_date must be greater than start_date",
    path: ["end_date"]
  })
});
