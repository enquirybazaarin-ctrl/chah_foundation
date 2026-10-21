import { z } from 'zod';

export const createCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255),
    category_id: z.union([
      z.string().regex(/^\d+$/),
      z.number().int().positive().transform(n => String(n))
    ]),
    short_description: z.string().max(2000).optional().nullable().or(z.literal('')),
    beneficiary_name: z.string().max(200).optional().nullable().or(z.literal('')),
    beneficiary_age: z.number().int().min(0).max(150).optional().nullable(),
    location: z.string().max(200).optional().nullable().or(z.literal('')),
    target_amount: z.union([
      z.number().min(0),
      z.string().regex(/^\d+(\.\d+)?$/).transform(n => Number(n))
    ]).optional().nullable(),
    raised_amount: z.union([
      z.number().min(0),
      z.string().regex(/^\d+(\.\d+)?$/).transform(n => Number(n))
    ]).optional().nullable(),
    start_date: z.string().optional().nullable().or(z.literal('')),
    end_date: z.string().optional().nullable().or(z.literal('')),
    content: z.string().min(1),
    featured_image_id: z.union([
      z.string().regex(/^\d+$/),
      z.number().int().positive().transform(n => String(n))
    ]).optional().nullable(),
    featured_image_url: z.string().max(1000).optional().nullable().or(z.literal('')),
    supporting_images: z.array(z.string()).optional().nullable(),
    is_featured: z.boolean().optional(),
    is_urgent: z.boolean().optional(),
    urgency_label: z.string().max(100).optional().nullable().or(z.literal('')),
    cta_button_text: z.string().max(100).optional().nullable().or(z.literal('')),
    sort_order: z.number().int().optional().nullable(),
    supporters_count: z.number().int().min(0).optional().nullable(),
  }).refine(data => {
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        return end >= start;
      }
    }
    return true;
  }, {
    message: "end_date must be greater than or equal to start_date",
    path: ["end_date"]
  })
});

export const updateCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255).optional(),
    category_id: z.union([
      z.string().regex(/^\d+$/),
      z.number().int().positive().transform(n => String(n))
    ]).optional(),
    short_description: z.string().max(2000).optional().nullable().or(z.literal('')),
    beneficiary_name: z.string().max(200).optional().nullable().or(z.literal('')),
    beneficiary_age: z.number().int().min(0).max(150).optional().nullable(),
    location: z.string().max(200).optional().nullable().or(z.literal('')),
    target_amount: z.union([
      z.number().min(0),
      z.string().regex(/^\d+(\.\d+)?$/).transform(n => Number(n))
    ]).optional().nullable(),
    raised_amount: z.union([
      z.number().min(0),
      z.string().regex(/^\d+(\.\d+)?$/).transform(n => Number(n))
    ]).optional().nullable(),
    start_date: z.string().optional().nullable().or(z.literal('')),
    end_date: z.string().optional().nullable().or(z.literal('')),
    content: z.string().min(1).optional(),
    featured_image_id: z.union([
      z.string().regex(/^\d+$/),
      z.number().int().positive().transform(n => String(n))
    ]).optional().nullable(),
    featured_image_url: z.string().max(1000).optional().nullable().or(z.literal('')),
    supporting_images: z.array(z.string()).optional().nullable(),
    is_featured: z.boolean().optional(),
    is_urgent: z.boolean().optional(),
    urgency_label: z.string().max(100).optional().nullable().or(z.literal('')),
    cta_button_text: z.string().max(100).optional().nullable().or(z.literal('')),
    sort_order: z.number().int().optional().nullable(),
    supporters_count: z.number().int().min(0).optional().nullable(),
  }).refine(data => {
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        return end >= start;
      }
    }
    return true;
  }, {
    message: "end_date must be greater than or equal to start_date",
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

export const updateEldercareSectionSettingsSchema = z.object({
  body: z.object({
    badge: z.string().max(100).optional(),
    heading: z.string().max(255).optional(),
    subheading: z.string().max(1000).optional(),
  }),
});

export const updateFoodSectionSettingsSchema = z.object({
  body: z.object({
    badge: z.string().max(100).optional(),
    heading: z.string().max(255).optional(),
    subheading: z.string().max(1000).optional(),
  }),
});
