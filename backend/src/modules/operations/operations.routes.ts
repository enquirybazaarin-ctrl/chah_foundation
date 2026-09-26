import { Router } from 'express';
import * as operationsController from './operations.controller';
import * as dashboardController from './dashboard.controller';
import * as exportController from './export.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { protect } from '../auth/auth.middleware';
import { requirePermission } from '../auth/rbac.middleware';
import { 
  createEnquirySchema, 
  updateEnquiryStatusSchema, 
  newsletterSignupSchema, 
  updateNewsletterStatusSchema, 
  upsertSettingSchema 
} from './operations.validation';

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Enquiries
router.post('/contact', validateRequest(createEnquirySchema), operationsController.submitEnquiry);

// Newsletter
router.post('/newsletter', validateRequest(newsletterSignupSchema), operationsController.subscribeNewsletter);

// Settings (Public fetch)
router.get('/settings/public', (req, res, next) => {
  if (req.headers.authorization || req.cookies?.token) {
    return protect(req, res, () => operationsController.getSettings(req, res, next));
  }
  return operationsController.getSettings(req, res, next);
});


// ==========================================
// PROTECTED ROUTES
// ==========================================
router.use(protect);

// Dashboard Summary
router.get(
  '/dashboard/summary',
  requirePermission('read', 'operations'), // Adjust permission as needed
  dashboardController.getDashboardSummary
);

// Reports & Exports
router.get('/export/donations', requirePermission('read', 'reports'), exportController.exportDonations);
router.get('/export/donors', requirePermission('read', 'reports'), exportController.exportDonors);
router.get('/export/campaigns', requirePermission('read', 'reports'), exportController.exportCampaigns);
router.get('/export/certificates', requirePermission('read', 'reports'), exportController.exportCertificates);

// Enquiries Management
router.get(
  '/enquiries',
  requirePermission('read', 'operations'),
  operationsController.getEnquiries
);

router.patch(
  '/enquiries/:id/status',
  requirePermission('update', 'operations'),
  validateRequest(updateEnquiryStatusSchema),
  operationsController.updateEnquiryStatus
);

// Newsletter Management
router.get(
  '/newsletter',
  requirePermission('read', 'operations'),
  operationsController.getSubscribers
);

router.patch(
  '/newsletter/:email/status',
  requirePermission('update', 'operations'),
  validateRequest(updateNewsletterStatusSchema),
  operationsController.updateSubscriberStatus
);

// Settings Management
router.get(
  '/settings',
  requirePermission('manage', 'settings'),
  operationsController.getSettings
);

router.post(
  '/settings',
  requirePermission('manage', 'settings'),
  validateRequest(upsertSettingSchema),
  operationsController.upsertSetting
);

router.delete(
  '/settings/:key',
  requirePermission('manage', 'settings'),
  operationsController.deleteSetting
);

// Audit Logs Management
router.get(
  '/audit-logs',
  requirePermission('read', 'audit_logs'),
  operationsController.getAuditLogs
);

// Automations - Form 10BE
router.get(
  '/form-10be',
  requirePermission('read', 'reports'),
  operationsController.getForm10BEReports
);

router.post(
  '/form-10be/generate',
  requirePermission('manage', 'reports'),
  operationsController.generateForm10BE
);

// Automations - Bank Reconciliation
router.get(
  '/reconciliation',
  requirePermission('read', 'donations'),
  operationsController.getReconciliationJobs
);

router.post(
  '/reconciliation/upload',
  requirePermission('manage', 'donations'),
  operationsController.uploadReconciliationFile
);

export default router;
