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
