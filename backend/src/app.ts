import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { prisma } from './config/database';
import { errorHandler } from './middleware/error.middleware';
import { AppError } from './utils/errors';

(BigInt.prototype as any).toJSON = function () { return this.toString(); };

const app = express();

// Security & Parsing Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow serving images cross-origin
}));

const allowedOrigins = [env.FRONTEND_URL, env.ADMIN_CORS_ORIGIN].filter(Boolean) as string[];
const devOrigins = [...allowedOrigins, 'http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'];

app.use(cors({ 
  origin: env.NODE_ENV === 'production' ? allowedOrigins : devOrigins,
  credentials: true 
}));
app.use(cookieParser());

// Razorpay Webhook requires raw body buffer for HMAC verification before global express.json()
import paymentRoutes from './modules/payments/payment.routes';
app.use('/api/v1/payments', express.raw({ type: 'application/json' }), paymentRoutes);

app.use(express.json({ limit: '10kb' }));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Serve uploaded static files
import path from 'path';
app.use('/media', express.static(path.join(process.cwd(), 'uploads')));

// Base API Routing Foundation
const apiRouter = express.Router();

app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Welcome to CHAH Foundation API' });
});

apiRouter.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'CHAH Foundation API v1 is running' });
});

app.use('/api/v1', apiRouter);

import authRoutes from './modules/auth/auth.routes';
apiRouter.use('/auth', authRoutes);

import donorRoutes from './modules/donors/donor.routes';
apiRouter.use('/donors', donorRoutes);

import donationRoutes from './modules/donations/donation.routes';
apiRouter.use('/donations', donationRoutes);

apiRouter.use('/payments', paymentRoutes);

import certificateRoutes from './modules/certificates/certificate.routes';
apiRouter.use('/certificates', certificateRoutes);

import subscriptionRoutes from './modules/subscriptions/subscription.routes';
apiRouter.use('/subscriptions', subscriptionRoutes);

import campaignCategoryRoutes from './modules/campaigns/category.routes';
apiRouter.use('/campaign-categories', campaignCategoryRoutes);

import campaignRoutes from './modules/campaigns/campaign.routes';
apiRouter.use('/campaigns', campaignRoutes);

import mediaRoutes from './modules/media/media.routes';
apiRouter.use('/media', mediaRoutes);

import albumRoutes from './modules/media/album.routes';
apiRouter.use('/albums', albumRoutes);

import projectRoutes from './modules/projects/project.routes';
apiRouter.use('/projects', projectRoutes);

import testimonialRoutes from './modules/testimonials/testimonial.routes';
apiRouter.use('/testimonials', testimonialRoutes);

import faqRoutes from './modules/faqs/faq.routes';
apiRouter.use('/faqs', faqRoutes);

import metricRoutes from './modules/metrics/metric.routes';
apiRouter.use('/impact-metrics', metricRoutes);

import cmsRoutes from './modules/cms/cms.routes';
apiRouter.use('/cms', cmsRoutes);

import operationsRoutes from './modules/operations/operations.routes';
apiRouter.use('/operations', operationsRoutes);

import userRoutes from './modules/users/user.routes';
apiRouter.use('/users', userRoutes);

// Health check endpoint (checks application and database readiness)
apiRouter.get('/health', async (req, res, next) => {
  try {
    // Ping DB to ensure connection is alive
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    next(new AppError('Database connection failed', 503));
  }
});

// Not Found Handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error-handling foundation
app.use(errorHandler);

// Initialize Event Listeners
import './events/donation.listeners';

export default app;
