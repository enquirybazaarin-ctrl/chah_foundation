import { Router } from 'express';
import * as projectController from './project.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { createProjectSchema, updateProjectSchema, projectQuerySchema, createActivitySchema, updateActivitySchema } from './project.validation';

const router = Router();

// Public routes
router.get('/', validateRequest(projectQuerySchema), projectController.getProjects);
router.get('/slug/:slug', projectController.getProjectBySlug);
router.get('/:id', projectController.getProjectById);

// Protected routes (Projects)
router.post(
  '/',
  protect,
  requirePermission('create', 'projects'),
  validateRequest(createProjectSchema),
  projectController.createProject
);

router.patch(
  '/:id',
  protect,
  requirePermission('update', 'projects'),
  validateRequest(updateProjectSchema),
  projectController.updateProject
);

router.patch(
  '/:id/status',
  protect,
  requirePermission('update', 'projects'),
  projectController.archiveProject
);

// Protected routes (Activities)
router.post(
  '/:id/activities',
  protect,
  requirePermission('update', 'projects'),
  validateRequest(createActivitySchema),
  projectController.createActivity
);

router.patch(
  '/:id/activities/:activityId',
  protect,
  requirePermission('update', 'projects'),
  validateRequest(updateActivitySchema),
  projectController.updateActivity
);

router.delete(
  '/:id/activities/:activityId',
  protect,
  requirePermission('update', 'projects'),
  projectController.deleteActivity
);

export default router;
