import { z } from 'zod';

export const createCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255),
    category_id: z.string().regex(/^\d+$/),
    short_description: z.string().max(1000).optional(),
    beneficiary_name: z.string().max(200).optional(),
    beneficiary_age: z.number().int().min(0).max(150).optional(),
    location: z.string().max(200).optional(),
    target_amount: z.number().positive().optional(),
    raised_amount: z.number().min(0).optional(),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
    content: z.string().min(1),
    featured_image_id: z.string().regex(/^\d+$/).optional(),
    featured_image_url: z.string().url().optional(),
    is_featured: z.boolean().optional(),
    is_urgent: z.boolean().optional(),
    urgency_label: z.string().max(100).optional(),
    cta_button_text: z.string().max(100).optional(),
    sort_order: z.number().int().optional(),
    supporters_count: z.number().int().min(0).optional(),
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
    short_description: z.string().max(1000).nullable().optional(),
    beneficiary_name: z.string().max(200).nullable().optional(),
    beneficiary_age: z.number().int().min(0).max(150).nullable().optional(),
    location: z.string().max(200).nullable().optional(),
    target_amount: z.number().positive().nullable().optional(),
    raised_amount: z.number().min(0).optional(),
    start_date: z.string().datetime().nullable().optional(),
    end_date: z.string().datetime().nullable().optional(),
    content: z.string().min(1).optional(),
    featured_image_id: z.string().regex(/^\d+$/).nullable().optional(),
    featured_image_url: z.string().url().nullable().optional(),
    is_featured: z.boolean().optional(),
    is_urgent: z.boolean().optional(),
    urgency_label: z.string().max(100).nullable().optional(),
    cta_button_text: z.string().max(100).optional(),
    sort_order: z.number().int().optional(),
    supporters_count: z.number().int().min(0).optional(),
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

export const updateFeaturedSectionSettingsSchema = z.object({
  body: z.object({
    badge: z.string().max(100).optional(),
    heading: z.string().max(255).optional(),
    subheading: z.string().max(1000).optional(),
  }),
});

export const updateMedicalSectionSettingsSchema = z.object({
  body: z.object({
    badge: z.string().max(100).optional(),
    heading: z.string().max(255).optional(),
    subheading: z.string().max(1000).optional(),
  }),
});
