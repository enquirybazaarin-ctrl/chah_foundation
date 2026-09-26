import api from './api';
import type { PaginatedResponse, Enquiry, EnquiryQueryParams, EnquiryStatus, AuditLog, AuditLogQueryParams } from './types';

export async function getEnquiries(params: EnquiryQueryParams = {}): Promise<PaginatedResponse<Enquiry>> {
  const res = await api.get<{ status: string; data: { enquiries: Enquiry[]; meta: any } }>(
    '/api/v1/operations/enquiries',
    { params }
  );
  const { enquiries, meta } = res.data.data;
  return {
    data: enquiries,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<Enquiry> {
  const res = await api.patch<{ status: string; data: { enquiry: Enquiry } }>(
    `/api/v1/operations/enquiries/${id}/status`,
    { status }
  );
  return res.data.data.enquiry;
}

export async function getDashboardSummary(): Promise<any> {
  const res = await api.get<{ status: string; data: any }>(
    '/api/v1/operations/dashboard/summary'
  );
  return res.data.data;
}

export function triggerExport(reportType: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/operations/export/${reportType}`;
  // We can just open this in a new tab or use an anchor tag download
  window.open(url, '_blank');
}

export async function getAuditLogs(params: AuditLogQueryParams = {}): Promise<PaginatedResponse<AuditLog>> {
  const res = await api.get<{ status: string; data: { logs: AuditLog[]; meta: any } }>(
    '/api/v1/operations/audit-logs',
    { params }
  );
  const { logs, meta } = res.data.data;
  return {
    data: logs,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit),
    },
  };
}

export async function getForm10BEReports(): Promise<any[]> {
  const res = await api.get<{ status: string; data: { reports: any[] } }>(
    '/api/v1/operations/form-10be'
  );
  return res.data.data.reports;
}

export async function generateForm10BE(financialYear: string): Promise<any> {
  const res = await api.post<{ status: string; data: { report: any } }>(
    '/api/v1/operations/form-10be/generate',
    { financial_year: financialYear }
  );
  return res.data.data.report;
}

export async function getReconciliationJobs(): Promise<any[]> {
  const res = await api.get<{ status: string; data: { jobs: any[] } }>(
    '/api/v1/operations/reconciliation'
  );
  return res.data.data.jobs;
}

export async function uploadReconciliationFile(csvContent: string, filename: string): Promise<any> {
  const res = await api.post<{ status: string; data: { job: any } }>(
    '/api/v1/operations/reconciliation/upload',
    { csv_content: csvContent, filename }
  );
  return res.data.data.job;
}
