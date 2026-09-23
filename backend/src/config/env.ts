import { z } from 'zod';
import dotenv from 'dotenv';

// Only load .env from file in non-production environments
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  FRONTEND_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long for production safety'),
  JWT_EXPIRES_IN: z.string().default('2h'),
  ADMIN_CORS_ORIGIN: z.string().min(1, 'ADMIN_CORS_ORIGIN is required for secure authentication requests'),
  RAZORPAY_KEY_ID: z.string().min(1, 'RAZORPAY_KEY_ID is required'),
  RAZORPAY_KEY_SECRET: z.string().min(1, 'RAZORPAY_KEY_SECRET is required'),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1, 'RAZORPAY_WEBHOOK_SECRET is required'),
  STORAGE_BASE_URL: z.string().optional(),
});

const envSchema = baseSchema.refine(
  (data) => !(data.NODE_ENV === 'production' && !data.FRONTEND_URL),
  { message: "FRONTEND_URL is required in production", path: ["FRONTEND_URL"] }
);

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
