import { z } from 'zod';

export const createFaqSchema = z.object({
  body: z.object({
    question: z.string().min(1, 'Question is required').max(1000, 'Question is too long'),
    answer: z.string().min(1, 'Answer is required').max(5000, 'Answer is too long'),
    category: z.string().max(255, 'Category is too long').optional().nullable(),
    is_published: z.boolean().optional(),
  })
});

export const updateFaqSchema = z.object({
  body: z.object({
    question: z.string().min(1, 'Question is required').max(1000, 'Question is too long').optional(),
    answer: z.string().min(1, 'Answer is required').max(5000, 'Answer is too long').optional(),
    category: z.string().max(255, 'Category is too long').optional().nullable(),
    is_published: z.boolean().optional(),
  })
});
