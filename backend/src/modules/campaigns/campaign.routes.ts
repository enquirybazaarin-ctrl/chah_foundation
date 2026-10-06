import { Router } from 'express';
import {
  createCampaign,
  getCampaignsPublic,
  getCampaignsAdmin,
  getCampaignBySlug,
  getCampaignById,
  updateCampaign,
  cancelCampaign,
  getFeaturedSection,
  updateFeaturedSectionSettings,
  getMedicalSection,
  updateMedicalSectionSettings,
} from './campaign.controller';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import {
  createCampaignSchema,
  updateCampaignSchema,
  updateFeaturedSectionSettingsSchema,
  updateMedicalSectionSettingsSchema,
} from './campaign.validation';

const router = Router();

// Public routes
router.get('/', getCampaignsPublic);
router.get('/featured-section', getFeaturedSection);
router.get('/medical-section', getMedicalSection);
router.get('/slug/:slug', getCampaignBySlug);

// Admin Section Settings
router.put(
  '/featured-section/settings',
  protect,
  requirePermission('update', 'campaigns'),
  validateRequest(updateFeaturedSectionSettingsSchema),
  updateFeaturedSectionSettings
);

router.put(
  '/medical-section/settings',
  protect,
  requirePermission('update', 'campaigns'),
  validateRequest(updateMedicalSectionSettingsSchema),
  updateMedicalSectionSettings
);

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
