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
  getEldercareSection,
  updateEldercareSectionSettings,
  getFoodSection,
  updateFoodSectionSettings,
  getCampaignSupporters,
  deleteCampaign,
} from './campaign.controller';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import {
  createCampaignSchema,
  updateCampaignSchema,
  updateFeaturedSectionSettingsSchema,
  updateMedicalSectionSettingsSchema,
  updateEldercareSectionSettingsSchema,
  updateFoodSectionSettingsSchema,
} from './campaign.validation';

const router = Router();

// Public routes
router.get('/', getCampaignsPublic);
router.get('/featured-section', getFeaturedSection);
router.get('/medical-section', getMedicalSection);
router.get('/eldercare-section', getEldercareSection);
router.get('/food-section', getFoodSection);
router.get('/slug/:slug', getCampaignBySlug);
router.get('/id/:id', getCampaignById);
router.get('/:id/supporters', getCampaignSupporters);

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

router.put(
  '/eldercare-section/settings',
  protect,
  requirePermission('update', 'campaigns'),
  validateRequest(updateEldercareSectionSettingsSchema),
  updateEldercareSectionSettings
);

router.put(
  '/food-section/settings',
  protect,
  requirePermission('update', 'campaigns'),
  validateRequest(updateFoodSectionSettingsSchema),
  updateFoodSectionSettings
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

router.delete(
  '/:id',
  protect,
  requirePermission('delete', 'campaigns'),
  deleteCampaign
);

export default router;
