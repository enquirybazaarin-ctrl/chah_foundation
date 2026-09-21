import { z } from 'zod';
import { PaymentType } from '@prisma/client';

export const donationValidation = {
  createOffline: z.object({
    body: z.object({
      amount: z.number().positive('Amount must be a positive number'),
      payment_type: z.nativeEnum(PaymentType),
      campaign_id: z.string().regex(/^\d+$/, 'Invalid campaign ID').optional(),
      is_anonymous: z.boolean().optional(),
      donor_message: z.string().max(1000).optional(),
      notes: z.string().max(1000).optional(),
      donor: z.object({
        first_name: z.string().min(1, 'First name is required').max(100),
        last_name: z.string().max(100).optional(),
        email: z.string().email('Invalid email format').optional().or(z.literal('')),
        phone: z.string().regex(/^\d{10,15}$/, 'Invalid phone number').optional().or(z.literal('')),
        pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').optional().or(z.literal('')),
        address: z.string().max(500).optional(),
        city: z.string().max(100).optional(),
        state: z.string().max(100).optional(),
        country: z.string().max(100).optional(),
        pincode: z.string().max(20).optional(),
      })
    })
  }),

  search: z.object({
    query: z.object({
      page: z.string().regex(/^\d+$/).transform(Number).optional(),
      limit: z.string().regex(/^\d+$/).transform(Number).optional(),
      search: z.string().optional(),
      status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED']).optional(),
      campaign_id: z.string().regex(/^\d+$/).optional()
    })
  }),

  getById: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid donation ID')
    })
  }),

  confirm: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid donation ID')
    })
  }),

  cancel: z.object({
    params: z.object({
      id: z.string().regex(/^\d+$/, 'Invalid donation ID')
    })
  })
};
