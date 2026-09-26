import { Router } from 'express';
import * as certificateController from './certificate.controller';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';

const router = Router();

router.use(protect);

router.get(
  '/',
  requirePermission('read', 'donations'), // Using donations permission for certificates 
  certificateController.getCertificates
);

router.post(
  '/generate',
  requirePermission('manage', 'donations'),
  certificateController.generateCertificate
);

export default router;
