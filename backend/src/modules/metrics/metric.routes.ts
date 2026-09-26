import { Router } from 'express';
import * as metricController from './metric.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { createMetricSchema, updateMetricSchema } from './metric.validation';

const router = Router();

// Public routes
router.get('/', metricController.getMetrics);
router.get('/:id', metricController.getMetricById);

// Protected routes
router.post(
  '/',
  protect,
  requirePermission('create', 'metrics'),
  validateRequest(createMetricSchema),
  metricController.createMetric
);

router.patch(
  '/:id',
  protect,
  requirePermission('update', 'metrics'),
  validateRequest(updateMetricSchema),
  metricController.updateMetric
);

router.delete(
  '/:id',
  protect,
  requirePermission('delete', 'metrics'),
  metricController.deleteMetric
);

export default router;
