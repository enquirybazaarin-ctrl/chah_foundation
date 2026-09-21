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
