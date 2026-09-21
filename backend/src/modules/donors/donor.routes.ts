import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import * as donorController from './donor.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { createDonorSchema, updateDonorSchema, donorQuerySchema } from './donor.validation';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';

const router = Router();

// Public Rate Limiter for Donor Checkout
const publicDonorRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 public creations per windowMs
  message: {
    status: 'error',
    message: 'Too many donor creations from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to evaluate if the request is public or admin
const evaluateContext = (req: Request, res: Response, next: NextFunction) => {
  // If the request has an authorization header or a cookie token, we attempt to authenticate
  // If no auth, we proceed as public
  if ((req.headers.authorization && req.headers.authorization.startsWith('Bearer')) || req.cookies?.token) {
    // It looks authenticated, pass it to protect and rbac
    return protect(req, res, () => {
      // Once authenticated, check permission
      requirePermission('create', 'donors')(req, res, next);
    });
  } else {
    // Proceed as public
    return publicDonorRateLimiter(req, res, next);
  }
};

// 1. POST /api/v1/donors
router.post(
  '/',
  evaluateContext,
  validateRequest(createDonorSchema),
  donorController.createDonor
);

// 2. GET /api/v1/donors
router.get(
  '/',
  protect,
  requirePermission('read', 'donors'),
  validateRequest(donorQuerySchema),
  donorController.getDonors
);

// 3. GET /api/v1/donors/:id
router.get(
  '/:id',
  protect,
  requirePermission('read', 'donors'),
  donorController.getDonorById
);

// 4. PATCH /api/v1/donors/:id
router.patch(
  '/:id',
  protect,
  requirePermission('update', 'donors'),
  validateRequest(updateDonorSchema),
  donorController.updateDonor
);

// 5. GET /api/v1/donors/:id/donations
router.get(
  '/:id/donations',
  protect,
  requirePermission('read', 'donors'),
  donorController.getDonorDonations
);

export default router;
