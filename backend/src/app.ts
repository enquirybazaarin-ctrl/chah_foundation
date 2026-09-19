import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { prisma } from './config/database';
import { errorHandler } from './middleware/error.middleware';
import { AppError } from './utils/errors';

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors({ origin: env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*' }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Base API Routing Foundation
const apiRouter = express.Router();
app.use('/api/v1', apiRouter);

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

export default app;
