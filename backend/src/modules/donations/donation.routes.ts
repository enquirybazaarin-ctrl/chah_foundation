import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { donationValidation } from './donation.validation';
import {
  createOfflineDonation,
  getDonations,
  getDonationById,
  confirmDonation,
  cancelDonation
} from './donation.controller';

const router = Router();

// All donation routes require authentication
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
