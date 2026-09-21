import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { donationValidation } from './donation.validation';
import {
  createOfflineDonation,
  createOnlineDonation,
  getDonations,
  getDonationById,
  confirmDonation,
  cancelDonation
} from './donation.controller';

import rateLimit from 'express-rate-limit';

const router = Router();

const isTest = process.env.NODE_ENV === 'test';

// Public Rate Limiter for Online Donations
const publicDonationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 100 : 5, // Limit each IP to 5 public creations per windowMs
  message: {
    status: 'error',
    message: 'Too many online donations from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Online Donation Creation (Public)
router.post(
  '/online',
  publicDonationRateLimiter,
  validateRequest(donationValidation.createOnline),
  createOnlineDonation
);

// All other donation routes require authentication
router.use(protect);

// Offline Donation Creation
router.post(
  '/offline',
  requirePermission('create', 'donations'),
  validateRequest(donationValidation.createOffline),
  createOfflineDonation
);

// Get all donations
router.get(
  '/',
  requirePermission('read', 'donations'),
  validateRequest(donationValidation.search),
  getDonations
);

// Get donation by ID
router.get(
  '/:id',
  requirePermission('read', 'donations'),
  validateRequest(donationValidation.getById),
  getDonationById
);

// Confirm offline donation
router.patch(
  '/:id/confirm',
  requirePermission('confirm', 'donations'),
  validateRequest(donationValidation.confirm),
  confirmDonation
);

// Cancel pending donation
router.patch(
  '/:id/cancel',
  requirePermission('update', 'donations'),
  validateRequest(donationValidation.cancel),
  cancelDonation
);

export default router;
