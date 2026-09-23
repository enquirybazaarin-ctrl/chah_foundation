import { Router } from 'express';
import multer from 'multer';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { updateMediaSchema } from './media.validation';
import { uploadMedia, getMediaList, getMedia, updateMedia, deleteMedia } from './media.controller';
import { AppError } from '../../utils/errors';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Restrict to images for now
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only JPEG, PNG, and WebP are allowed.', 400));
    }
  }
});

router.use(protect);

router.post(
  '/',
  requirePermission('manage', 'media'),
  upload.single('file'), // 'file' is the field name
  uploadMedia
);

router.get(
  '/',
  getMediaList
);

router.get(
  '/:id',
  getMedia
);

router.patch(
  '/:id',
  requirePermission('manage', 'media'),
  validateRequest(updateMediaSchema),
  updateMedia
);

router.delete(
  '/:id',
  requirePermission('manage', 'media'),
  deleteMedia
);

export default router;
