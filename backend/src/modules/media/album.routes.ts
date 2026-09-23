import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { createAlbumSchema, updateAlbumSchema } from './album.validation';
import { createAlbum, getAlbums, getAlbum, updateAlbum, deleteAlbum } from './album.controller';

const router = Router();

// Allow public read access to albums (if applicable) or keep it protected?
// Usually albums might be queried for public gallery, but for now we'll protect the API 
// or allow GET without auth if they are public. Let's protect them all with auth first, 
// then maybe allow public GET in a separate endpoint if needed.
// Based on typical NGO needs, GET /albums is safe to be public or at least for admins.
// We'll require auth for all for now, standard for CMS backend.

router.use(protect);

router.post(
  '/',
  requirePermission('manage', 'media'),
  validateRequest(createAlbumSchema),
  createAlbum
);

router.get(
  '/',
  getAlbums // Authenticated users can view albums
);

router.get(
  '/:id',
  getAlbum
);

router.patch(
  '/:id',
  requirePermission('manage', 'media'),
  validateRequest(updateAlbumSchema),
  updateAlbum
);

router.delete(
  '/:id',
  requirePermission('manage', 'media'),
  deleteAlbum
);

export default router;
