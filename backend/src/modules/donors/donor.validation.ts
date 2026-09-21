import { z } from 'zod';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const createDonorSchema = z.object({
  body: z.object({
    first_name: z.string().min(1, 'First name is required').max(100),
    last_name: z.string().max(100).optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().max(20).optional().or(z.literal('')),
    pan_number: z.string().regex(PAN_REGEX, 'Invalid PAN format').optional().or(z.literal('')),
    address: z.string().max(500).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    pincode: z.string().max(20).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional()
  }).strip() // Strictly remove unknown fields
});

export const updateDonorSchema = z.object({
  body: z.object({
    first_name: z.string().min(1, 'First name cannot be empty').max(100).optional(),
    last_name: z.string().max(100).optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().max(20).optional().or(z.literal('')),
    pan_number: z.string().regex(PAN_REGEX, 'Invalid PAN format').optional().or(z.literal('')),
    address: z.string().max(500).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    pincode: z.string().max(20).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional()
  }).strip()
});

export const donorQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional()
  }).strip()
});
