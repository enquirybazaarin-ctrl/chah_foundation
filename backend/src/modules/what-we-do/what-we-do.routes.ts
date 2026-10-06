import { Router } from 'express';
import * as whatWeDoController from './what-we-do.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import {
  createWhatWeDoCardSchema,
  updateWhatWeDoCardSchema,
  toggleWhatWeDoCardSchema,
  updateSectionSettingsSchema,
} from './what-we-do.validation';

const router = Router();

// Public: Website gets active cards + section headings
router.get('/', whatWeDoController.getPublicData);

// Protected: Admin operations
router.get(
  '/admin/all',
  protect,
  requirePermission('read', 'cms'),
  whatWeDoController.getAllCards
);

router.put(
  '/settings',
  protect,
  requirePermission('update', 'cms'),
  validateRequest(updateSectionSettingsSchema),
  whatWeDoController.updateSectionSettings
);

router.get(
  '/:id',
  protect,
  requirePermission('read', 'cms'),
  whatWeDoController.getCardById
);

router.post(
  '/',
  protect,
  requirePermission('create', 'cms'),
  validateRequest(createWhatWeDoCardSchema),
  whatWeDoController.createCard
);

router.put(
  '/:id',
  protect,
  requirePermission('update', 'cms'),
  validateRequest(updateWhatWeDoCardSchema),
  whatWeDoController.updateCard
);

router.patch(
  '/:id/toggle',
  protect,
  requirePermission('update', 'cms'),
  validateRequest(toggleWhatWeDoCardSchema),
  whatWeDoController.toggleCard
);

router.delete(
  '/:id',
  protect,
  requirePermission('delete', 'cms'),
  whatWeDoController.deleteCard
);

export default router;
