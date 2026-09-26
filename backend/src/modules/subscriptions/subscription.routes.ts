import { Router } from 'express';
import * as subscriptionController from './subscription.controller';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';

const router = Router();

router.use(protect);

router.get(
  '/',
  requirePermission('read', 'donations'), // Subscriptions fall under donations permission scope
  subscriptionController.getSubscriptions
);

router.get(
  '/:id',
  requirePermission('read', 'donations'),
  subscriptionController.getSubscription
);

router.patch(
  '/:id/status',
  requirePermission('manage', 'donations'),
  subscriptionController.updateSubscriptionStatus
);

export default router;
