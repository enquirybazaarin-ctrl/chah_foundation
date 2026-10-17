import { Router } from 'express';
import * as knowAboutUsController from './know-about-us.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import {
  updateKnowAboutUsSchema,
  addImageSchema,
  deleteImageSchema,
} from './know-about-us.validation';

const router = Router();

// Public: Website reads section content and images
router.get('/', knowAboutUsController.getData);

// Protected: Admin reads, updates, and manages images
router.get(
  '/admin',
  protect,
  requirePermission('read', 'cms'),
  knowAboutUsController.getData
);

router.put(
  '/',
  protect,
  requirePermission('update', 'cms'),
  validateRequest(updateKnowAboutUsSchema),
  knowAboutUsController.updateData
);

router.post(
  '/images',
  protect,
  requirePermission('create', 'cms'),
  validateRequest(addImageSchema),
  knowAboutUsController.addImage
);

router.post(
  '/images/delete',
  protect,
  requirePermission('delete', 'cms'),
  validateRequest(deleteImageSchema),
  knowAboutUsController.deleteImage
);

export default router;
