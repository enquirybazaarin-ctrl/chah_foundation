import { z } from 'zod';
import dotenv from 'dotenv';

// Load .env configuration
dotenv.config();

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.string().default(process.env.PORT || '44000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  FRONTEND_URL: z.string().default('https://new.chahfoundation.com,https://chahfoundation.com'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long for production safety').default('chah_foundation_production_jwt_secret_key_2026_super_secure'),
  JWT_EXPIRES_IN: z.string().default('2h'),
  ADMIN_CORS_ORIGIN: z.string().default('https://admin.chahfoundation.com'),
  RAZORPAY_KEY_ID: z.string().default('rzp_live_placeholder'),
  RAZORPAY_KEY_SECRET: z.string().default('placeholder_secret'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('placeholder_webhook'),
  STORAGE_BASE_URL: z.string().optional(),
  STORAGE_DIR: z.string().optional(),
  MSG91_API_KEY: z.string().optional(),
  MSG91_80G_TEMPLATE_ID: z.string().optional(),
  MSG91_FROM_EMAIL: z.string().optional(),
  MSG91_FROM_NAME: z.string().optional(),
  MSG91_DOMAIN: z.string().optional(),
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
