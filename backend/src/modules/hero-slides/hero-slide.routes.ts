import { Router } from 'express';
import * as heroSlideController from './hero-slide.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { createHeroSlideSchema, updateHeroSlideSchema, toggleHeroSlideSchema } from './hero-slide.validation';

const router = Router();

// Public: Website gets active slides
router.get('/', heroSlideController.getActiveSlides);

// Protected: Admin operations
router.get(
  '/admin/all',
  protect,
  requirePermission('read', 'cms'),
  heroSlideController.getAllSlides
);

router.get(
  '/:id',
  protect,
  requirePermission('read', 'cms'),
  heroSlideController.getSlideById
);

router.post(
  '/',
  protect,
  requirePermission('create', 'cms'),
  validateRequest(createHeroSlideSchema),
  heroSlideController.createSlide
);

router.put(
  '/:id',
  protect,
  requirePermission('update', 'cms'),
  validateRequest(updateHeroSlideSchema),
  heroSlideController.updateSlide
);

router.patch(
  '/:id/toggle',
  protect,
  requirePermission('update', 'cms'),
  validateRequest(toggleHeroSlideSchema),
  heroSlideController.toggleSlide
);

router.delete(
  '/:id',
  protect,
  requirePermission('delete', 'cms'),
  heroSlideController.deleteSlide
);

export default router;
