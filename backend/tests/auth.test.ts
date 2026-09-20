import request from 'supertest';
import express from 'express';
import app from '../src/app';
import { prisma } from '../src/config/database';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env';
import cookieParser from 'cookie-parser';
import { protect } from '../src/modules/auth/auth.middleware';
import { requirePermission } from '../src/modules/auth/rbac.middleware';

// Create an isolated route for RBAC testing
const testApp = express();
testApp.use(cookieParser());
testApp.use('/test-rbac', protect, requirePermission('create', 'donations'), (req, res) => {
  res.status(200).json({ success: true });
});
// Error handler to serialize AppError for testApp
testApp.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.statusCode || 500).json({ status: 'error', message: err.message });
});

// Mock prisma and argon2
jest.mock('../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    }
  }
}));

jest.mock('argon2', () => ({
  verify: jest.fn(),
}));

describe('Authentication & RBAC', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 401 for unknown user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'unknown@example.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
      expect(prisma.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ action: 'LOGIN_FAILED' })
      }));
    });

    it('should return 401 for invalid password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1n,
        email: 'test@example.com',
        password_hash: 'hashed',
        status: 'ACTIVE'
      });
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should return 401 for INACTIVE user', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1n,
        email: 'test@example.com',
        password_hash: 'hashed',
        status: 'INACTIVE'
      });
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should return 401 for SUSPENDED user and not issue JWT', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1n,
        email: 'test@example.com',
        password_hash: 'hashed',
        status: 'SUSPENDED'
      });
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
      expect(res.headers['set-cookie']).toBeUndefined();
    });

    it('should login successfully and set HttpOnly cookie', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1n,
        email: 'test@example.com',
        password_hash: 'hashed',
        status: 'ACTIVE',
        role: {
          permissions: []
        }
      });
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie'][0]).toMatch(/token=.*HttpOnly/);
      expect(res.body.token).toBeUndefined();
    });

    it('should limit login attempts (Rate Limiting)', async () => {
      // Because rate limiter is in-memory and stateful across tests, 
      // we just simulate sending 11 requests in total.
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      
      let lastRes;
      for (let i = 0; i < 11; i++) {
        lastRes = await request(app)
          .post('/api/v1/auth/login')
          .send({ email: 'rate@example.com', password: 'p' });
      }
      
      expect(lastRes?.status).toBe(429);
      expect(lastRes?.body.message).toContain('Too many login attempts');
    });
  });
  
  describe('GET /api/v1/auth/me', () => {
    it('should return 401 if no cookie is provided', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return 401 for invalid JWT', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', ['token=invalid.jwt.token']);
      
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid or expired token');
    });

    it('should return 401 for expired JWT', async () => {
      const expiredToken = jwt.sign({ id: '1' }, env.JWT_SECRET, { expiresIn: '-1h' });
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', [`token=${expiredToken}`]);
      
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid or expired token');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should clear cookie and return 200 without returning JWT', async () => {
      const validToken = jwt.sign({ id: '1' }, env.JWT_SECRET, { expiresIn: '1h' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1n, email: 'test@example.com', status: 'ACTIVE', role: { permissions: [] }
      });

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', [`token=${validToken}`]);

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie'][0]).toMatch(/token=;/);
      expect(res.body.token).toBeUndefined();
    });
  });

  describe('RBAC Middleware', () => {
    it('should allow access if permission is granted', async () => {
      const validToken = jwt.sign({ id: '1' }, env.JWT_SECRET, { expiresIn: '1h' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1n,
        email: 'test@example.com',
        status: 'ACTIVE',
        role: {
          permissions: [
            { permission: { action: 'create', resource: 'donations' } }
          ]
        }
      });

      const res = await request(testApp)
        .get('/test-rbac')
        .set('Cookie', [`token=${validToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should deny access with 403 if permission is missing', async () => {
      const validToken = jwt.sign({ id: '1' }, env.JWT_SECRET, { expiresIn: '1h' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1n,
        email: 'test@example.com',
        status: 'ACTIVE',
        role: {
          permissions: [
            { permission: { action: 'read', resource: 'donations' } }
          ]
        }
      });

      const res = await request(testApp)
        .get('/test-rbac')
        .set('Cookie', [`token=${validToken}`]);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('You do not have permission to perform this action.');
    });
  });
});
