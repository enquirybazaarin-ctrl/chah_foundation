import { Router } from 'express';
import * as cmsController from './cms.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { 
  createBlogCategorySchema, updateBlogCategorySchema, 
  createTagSchema, updateTagSchema, 
  createBlogSchema, updateBlogSchema 
} from './cms.validation';

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Blogs
router.get('/blogs', (req, res, next) => {
  if (req.headers.authorization || req.cookies?.token) {
    return protect(req, res, () => cmsController.getBlogs(req, res, next));
  }
  return cmsController.getBlogs(req, res, next);
});
router.get('/blogs/slug/:slug', cmsController.getBlogBySlug);
router.get('/blogs/:id', cmsController.getBlogById);

// Categories
router.get('/categories', cmsController.getCategories);

// Tags
router.get('/tags', cmsController.getTags);


// ==========================================
// PROTECTED ROUTES
// ==========================================
router.use(protect);

// Blog Categories
router.post(
  '/categories',
  requirePermission('create', 'cms'),
  validateRequest(createBlogCategorySchema),
  cmsController.createCategory
);

router.patch(
  '/categories/:id',
  requirePermission('update', 'cms'),
  validateRequest(updateBlogCategorySchema),
  cmsController.updateCategory
);

router.delete(
  '/categories/:id',
  requirePermission('delete', 'cms'),
  cmsController.deleteCategory
);

// Tags
router.post(
  '/tags',
  requirePermission('create', 'cms'),
  validateRequest(createTagSchema),
  cmsController.createTag
);

router.patch(
  '/tags/:id',
  requirePermission('update', 'cms'),
  validateRequest(updateTagSchema),
  cmsController.updateTag
);

router.delete(
  '/tags/:id',
  requirePermission('delete', 'cms'),
  cmsController.deleteTag
);

// Blogs
router.post(
  '/blogs',
  requirePermission('create', 'cms'),
  validateRequest(createBlogSchema),
  cmsController.createBlog
);

router.patch(
  '/blogs/:id',
  requirePermission('update', 'cms'),
  validateRequest(updateBlogSchema),
  cmsController.updateBlog
);

router.patch(
  '/blogs/:id/status',
  requirePermission('update', 'cms'),
  cmsController.archiveBlog
);

export default router;
