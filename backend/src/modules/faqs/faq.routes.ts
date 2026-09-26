import { Router } from 'express';
import * as faqController from './faq.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { createFaqSchema, updateFaqSchema } from './faq.validation';

const router = Router();

// Public routes (Admins see all, public sees published)
router.get('/', (req, res, next) => {
  if (req.headers.authorization || req.cookies?.token) {
    return protect(req, res, () => faqController.getFaqs(req, res, next));
  }
  return faqController.getFaqs(req, res, next);
});

router.get('/:id', faqController.getFaqById);

// Protected routes
router.post(
  '/',
  protect,
  requirePermission('create', 'faqs'),
  validateRequest(createFaqSchema),
  faqController.createFaq
);

router.patch(
  '/:id',
  protect,
  requirePermission('update', 'faqs'),
  validateRequest(updateFaqSchema),
  faqController.updateFaq
);

router.delete(
  '/:id',
  protect,
  requirePermission('delete', 'faqs'),
  faqController.deleteFaq
);

export default router;
