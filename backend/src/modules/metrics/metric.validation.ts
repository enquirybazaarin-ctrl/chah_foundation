import { z } from 'zod';

export const createMetricSchema = z.object({
  body: z.object({
    metric_name: z.string().min(1, 'Metric name is required').max(255, 'Metric name is too long'),
    metric_value: z.string().min(1, 'Metric value is required').max(255, 'Metric value is too long'),
    icon: z.string().max(255, 'Icon string is too long').optional().nullable(),
  })
});

export const updateMetricSchema = z.object({
  body: z.object({
    metric_name: z.string().min(1, 'Metric name is required').max(255, 'Metric name is too long').optional(),
    metric_value: z.string().min(1, 'Metric value is required').max(255, 'Metric value is too long').optional(),
    icon: z.string().max(255, 'Icon string is too long').optional().nullable(),
  })
});
