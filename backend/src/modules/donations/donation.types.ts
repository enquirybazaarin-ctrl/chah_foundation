import { Prisma, PrismaClient, PaymentType, DonationStatus } from '@prisma/client';

export type PrismaClientOrTransaction = Prisma.TransactionClient | PrismaClient;

export interface AuditContext {
  actorUserId?: bigint;
  ipAddress?: string;
  userAgent?: string;
}

export interface DonorDTO {
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  pan_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface CreateOnlineDonationDTO {
  idempotency_key: string;
  donor: DonorDTO;
  amount: number;
  campaign_id?: bigint;
  is_anonymous?: boolean;
  donor_message?: string;
}

export interface CreateOfflineDonationDTO {
  donor: DonorDTO;
  amount: number;
  payment_type: PaymentType;
  campaign_id?: bigint;
  is_anonymous?: boolean;
  donor_message?: string;
  notes?: string;
}

export interface DonationSearchQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: DonationStatus;
  campaign_id?: bigint;
}

export interface VerifyOnlineDonationDTO {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface ProcessSuccessfulPaymentParams {
  paymentId: bigint;
  providerPaymentId: string;
  paymentMethod?: string;
  auditContext: AuditContext;
  webhookEventId?: bigint;
}
