import { Router } from 'express';
import {
  createCampaign,
  getCampaignsPublic,
  getCampaignsAdmin,
  getCampaignBySlug,
  getCampaignById,
  updateCampaign,
  cancelCampaign
} from './campaign.controller';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { createCampaignSchema, updateCampaignSchema } from './campaign.validation';

const router = Router();

// Public routes
router.get('/', getCampaignsPublic);
router.get('/slug/:slug', getCampaignBySlug);

// Admin routes
router.get(
  '/admin',
  protect,
  requirePermission('read', 'campaigns'),
  getCampaignsAdmin
);

router.get(
  '/:id',
  protect,
  requirePermission('read', 'campaigns'),
  getCampaignById
);

router.post(
  '/',
  protect,
  requirePermission('create', 'campaigns'),
  validateRequest(createCampaignSchema),
  createCampaign
);

router.patch(
  '/:id',
  protect,
  requirePermission('update', 'campaigns'),
  validateRequest(updateCampaignSchema),
  updateCampaign
);

router.patch(
  '/:id/status',
  protect,
  requirePermission('delete', 'campaigns'),
  cancelCampaign
);

export default router;
