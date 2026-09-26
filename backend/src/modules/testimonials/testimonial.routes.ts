import { Router } from 'express';
import * as testimonialController from './testimonial.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { createTestimonialSchema, updateTestimonialSchema } from './testimonial.validation';

const router = Router();

// Public routes (Admins see all, public sees published)
// We add an optional protect middleware so `req.user` is populated if a token exists
router.get('/', (req, res, next) => {
  if (req.headers.authorization || req.cookies?.token) {
    return protect(req, res, () => testimonialController.getTestimonials(req, res, next));
  }
  return testimonialController.getTestimonials(req, res, next);
});

router.get('/:id', testimonialController.getTestimonialById);

// Protected routes
router.post(
  '/',
  protect,
  requirePermission('create', 'testimonials'),
  validateRequest(createTestimonialSchema),
  testimonialController.createTestimonial
);

router.patch(
  '/:id',
  protect,
  requirePermission('update', 'testimonials'),
  validateRequest(updateTestimonialSchema),
  testimonialController.updateTestimonial
);

router.delete(
  '/:id',
  protect,
  requirePermission('delete', 'testimonials'),
  testimonialController.deleteTestimonial
);

export default router;
