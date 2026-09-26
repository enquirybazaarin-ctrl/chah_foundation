import { z } from 'zod';

export const createEnquirySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255),
    email: z.string().email('Invalid email address'),
    phone: z.string().max(20).optional(),
    subject: z.string().min(1, 'Subject is required').max(255),
    message: z.string().min(1, 'Message is required'),
  })
});

export const updateEnquiryStatusSchema = z.object({
  body: z.object({
    status: z.enum(['UNREAD', 'READ', 'RESOLVED']),
  })
});

export const newsletterSignupSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  })
});

export const updateNewsletterStatusSchema = z.object({
  body: z.object({
    status: z.enum(['SUBSCRIBED', 'UNSUBSCRIBED']),
  })
});

export const upsertSettingSchema = z.object({
  body: z.object({
    setting_key: z.string().min(1, 'Key is required').max(100),
    setting_value: z.string().min(1, 'Value is required'),
  })
});

export const operationsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.string().optional(),
  })
});
