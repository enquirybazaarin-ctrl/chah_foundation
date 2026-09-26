import { prisma } from '../../config/database';
import { CreateEnquiryInput, NewsletterSignupInput, OperationsQueryOptions, CreateAuditLogInput, UpsertSettingInput } from './operations.types';
import { ContactStatus, SubscriberStatus } from '@prisma/client';

export class OperationsRepository {
  // ----------------------------------------------------
  // Contact Enquiries
  // ----------------------------------------------------
  async createEnquiry(data: CreateEnquiryInput) {
    return prisma.contactEnquiry.create({
      data: {
        ...data,
        status: 'UNREAD'
      }
    });
  }

  async findEnquiries(options: OperationsQueryOptions) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.status) {
      where.status = options.status as ContactStatus;
    }

    const [enquiries, total] = await Promise.all([
      prisma.contactEnquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.contactEnquiry.count({ where })
    ]);

    return { enquiries, total };
  }

  async findEnquiryById(id: bigint) {
    return prisma.contactEnquiry.findUnique({ where: { id } });
  }

  async updateEnquiryStatus(id: bigint, status: ContactStatus) {
    return prisma.contactEnquiry.update({
      where: { id },
      data: { status }
    });
  }

  // ----------------------------------------------------
  // Newsletter
  // ----------------------------------------------------
  async createSubscriber(data: NewsletterSignupInput) {
    return prisma.newsletterSubscriber.create({
      data: {
        email: data.email,
        status: 'SUBSCRIBED'
      }
    });
  }

  async findSubscriberByEmail(email: string) {
    return prisma.newsletterSubscriber.findUnique({ where: { email } });
  }

  async updateSubscriberStatus(email: string, status: SubscriberStatus) {
    return prisma.newsletterSubscriber.update({
      where: { email },
      data: { status }
    });
  }

  async findSubscribers(options: OperationsQueryOptions) {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.status) {
      where.status = options.status as SubscriberStatus;
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.newsletterSubscriber.count({ where })
    ]);

    return { subscribers, total };
  }

  // ----------------------------------------------------
  // Settings
  // ----------------------------------------------------
  async upsertSetting(data: UpsertSettingInput) {
    return prisma.setting.upsert({
      where: { setting_key: data.setting_key },
      update: { setting_value: data.setting_value },
      create: {
        setting_key: data.setting_key,
        setting_value: data.setting_value
      }
    });
  }

  async findSettings(keys?: string[]) {
    const where = keys && keys.length > 0 ? { setting_key: { in: keys } } : {};
    return prisma.setting.findMany({ where });
  }

  async deleteSetting(key: string) {
    return prisma.setting.delete({ where: { setting_key: key } });
  }

  // ----------------------------------------------------
  // Audit Logs
  // ----------------------------------------------------
  async createAuditLog(data: CreateAuditLogInput) {
    return prisma.auditLog.create({
      data: {
        user_id: data.user_id || null,
        action: data.action,
        entity_type: data.entity_type,
        entity_id: data.entity_id,
        old_values: data.old_values ? data.old_values : null,
        new_values: data.new_values ? data.new_values : null,
        ip_address: data.ip_address,
        user_agent: data.user_agent
      }
    });
  }

  async findAuditLogs(options: OperationsQueryOptions & { entity_type?: string, action?: string }) {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.entity_type) where.entity_type = options.entity_type;
    if (options.action) where.action = options.action;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.auditLog.count({ where })
    ]);

    return { logs, total };
  }

  // ----------------------------------------------------
  // Automations - Priority 1
  // ----------------------------------------------------
  async getForm10BEReports() {
    return prisma.form10BEReport.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async createForm10BEReport(financial_year: string, generated_by: bigint) {
    return prisma.form10BEReport.create({
      data: {
        financial_year,
        generated_by,
        status: 'PENDING'
      }
    });
  }

  async getReconciliationJobs() {
    return prisma.bankReconciliationJob.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async createReconciliationJob(filename: string, uploaded_by: bigint) {
    return prisma.bankReconciliationJob.create({
      data: {
        filename,
        uploaded_by,
        status: 'PROCESSING'
      }
    });
  }
}

export const operationsRepository = new OperationsRepository();
