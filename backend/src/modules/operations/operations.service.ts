import { operationsRepository } from './operations.repository';
import { 
  CreateEnquiryInput, 
  UpdateEnquiryStatusInput, 
  NewsletterSignupInput, 
  UpdateNewsletterStatusInput, 
  UpsertSettingInput, 
  OperationsQueryOptions 
} from './operations.types';
import { AppError } from '../../utils/errors';
import { ContactStatus, SubscriberStatus } from '@prisma/client';

const PUBLIC_SETTINGS_KEYS = [
  'NGO_CONTACT_EMAIL',
  'NGO_CONTACT_PHONE',
  'NGO_ADDRESS',
  'SOCIAL_FACEBOOK',
  'SOCIAL_TWITTER',
  'SOCIAL_INSTAGRAM',
  'SOCIAL_LINKEDIN'
];

export class OperationsService {
  // ----------------------------------------------------
  // Contact Enquiries
  // ----------------------------------------------------
  async submitEnquiry(data: CreateEnquiryInput) {
    return operationsRepository.createEnquiry(data);
  }

  async getEnquiries(options: OperationsQueryOptions) {
    return operationsRepository.findEnquiries(options);
  }

  async updateEnquiryStatus(id: bigint, data: UpdateEnquiryStatusInput) {
    const enquiry = await operationsRepository.findEnquiryById(id);
    if (!enquiry) throw new AppError('Enquiry not found', 404);
    
    return operationsRepository.updateEnquiryStatus(id, data.status as ContactStatus);
  }

  // ----------------------------------------------------
  // Newsletter
  // ----------------------------------------------------
  async subscribeNewsletter(data: NewsletterSignupInput) {
    const existing = await operationsRepository.findSubscriberByEmail(data.email);
    
    if (existing) {
      if (existing.status === 'UNSUBSCRIBED') {
        return operationsRepository.updateSubscriberStatus(data.email, 'SUBSCRIBED');
      }
      // If already subscribed, return the existing record gracefully
      return existing;
    }

    return operationsRepository.createSubscriber(data);
  }

  async updateSubscriberStatus(email: string, data: UpdateNewsletterStatusInput) {
    const existing = await operationsRepository.findSubscriberByEmail(email);
    if (!existing) throw new AppError('Subscriber not found', 404);

    return operationsRepository.updateSubscriberStatus(email, data.status as SubscriberStatus);
  }

  async getSubscribers(options: OperationsQueryOptions) {
    return operationsRepository.findSubscribers(options);
  }

  // ----------------------------------------------------
  // Settings
  // ----------------------------------------------------
  async upsertSetting(data: UpsertSettingInput) {
    return operationsRepository.upsertSetting(data);
  }

  async getSettings(isAdmin: boolean = false) {
    if (isAdmin) {
      return operationsRepository.findSettings();
    }
    // Public fetch: only allow safe keys
    return operationsRepository.findSettings(PUBLIC_SETTINGS_KEYS);
  }

  async deleteSetting(key: string) {
    try {
      await operationsRepository.deleteSetting(key);
    } catch {
      throw new AppError('Setting not found or could not be deleted', 404);
    }
  }

  // ----------------------------------------------------
  // Audit Logs
  // ----------------------------------------------------
  async getAuditLogs(options: OperationsQueryOptions & { entity_type?: string, action?: string }) {
    return operationsRepository.findAuditLogs(options);
  }

  /**
   * Safe fire-and-forget internal method for writing audit logs from other domains
   */
  async logAction(
    action: string,
    entity_type: string,
    entity_id: bigint,
    user_id?: bigint | null,
    old_values?: any,
    new_values?: any,
    ip_address?: string,
    user_agent?: string
  ) {
    try {
      await operationsRepository.createAuditLog({
        action,
        entity_type,
        entity_id,
        user_id,
        old_values,
        new_values,
        ip_address,
        user_agent
      });
    } catch (err) {
      console.error('Failed to write audit log:', err);
      // We don't throw here to avoid failing critical business flows due to logging errors
    }
  }

  // ----------------------------------------------------
  // Automations - Priority 1
  // ----------------------------------------------------
  async getForm10BEReports() {
    return operationsRepository.getForm10BEReports();
  }

  async generateForm10BE(financialYear: string, userId: bigint) {
    if (!financialYear) throw new AppError('Financial year is required (e.g. 2024-2025)', 400);
    
    // Create job record
    const report = await operationsRepository.createForm10BEReport(financialYear, userId);
    
    // Kick off async processing (In a real queue, we'd add to BullMQ here)
    this.processForm10BE(report.id, financialYear).catch(console.error);
    
    return report;
  }

  private async processForm10BE(reportId: bigint, financialYear: string) {
    // Stub for async Form 10BE generation
    try {
      // 1. Fetch donations for the FY where PAN is not null
      // 2. Group by donor PAN
      // 3. Generate CSV in Income Tax format
      // 4. Upload to S3/Cloud storage
      
      // For now, simulate success after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { prisma } = require('../../config/database');
      await prisma.form10BEReport.update({
        where: { id: reportId },
        data: {
          status: 'COMPLETED',
          file_url: `/dummy-10be-report-${financialYear}.csv`
        }
      });
      
    } catch (err) {
      const { prisma } = require('../../config/database');
      await prisma.form10BEReport.update({
        where: { id: reportId },
        data: { status: 'FAILED' }
      }).catch(() => {});
    }
  }

  async getReconciliationJobs() {
    return operationsRepository.getReconciliationJobs();
  }

  async processBankReconciliation(csvContent: string, filename: string, userId: bigint) {
    const job = await operationsRepository.createReconciliationJob(filename, userId);
    
    // Kick off async processing
    this.executeBankReconciliation(job.id, csvContent).catch(console.error);
    
    return job;
  }

  private async executeBankReconciliation(jobId: bigint, csvContent: string) {
    try {
      // Stub for async CSV reconciliation
      // 1. Parse CSV string
      // 2. Loop through rows, finding NEFT/RTGS references
      // 3. Match against PENDING manual donations (amount + approx date)
      // 4. Update matched donations to SUCCESS
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { prisma } = require('../../config/database');
      await prisma.bankReconciliationJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          total_records: 100, // mock
          matched_records: 4 // mock
        }
      });
    } catch (err) {
      const { prisma } = require('../../config/database');
      await prisma.bankReconciliationJob.update({
        where: { id: jobId },
        data: { status: 'FAILED' }
      }).catch(() => {});
    }
  }
}

export const operationsService = new OperationsService();
