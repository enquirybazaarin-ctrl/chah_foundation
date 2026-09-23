import { Router } from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory } from './category.controller';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { createCampaignCategorySchema, updateCampaignCategorySchema } from './category.validation';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post(
  '/',
  protect,
  requirePermission('create', 'campaigns'),
  validateRequest(createCampaignCategorySchema),
  createCategory
);

router.patch(
  '/:id',
  protect,
  requirePermission('update', 'campaigns'),
  validateRequest(updateCampaignCategorySchema),
  updateCategory
);

export default router;
