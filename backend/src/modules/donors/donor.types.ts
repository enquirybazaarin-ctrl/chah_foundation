import { Prisma } from '@prisma/client';

export type DonorStatus = 'ACTIVE' | 'INACTIVE';

export interface CreateDonorDTO {
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
  status?: DonorStatus;
}

export interface UpdateDonorDTO {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  pan_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  status?: DonorStatus;
}

export interface DonorSearchQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: DonorStatus;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface AuditContext {
  actorUserId?: bigint;
  ipAddress?: string;
  userAgent?: string;
}

// Ensure the repository can accept prisma transaction client or default client
export type PrismaClientOrTransaction = Prisma.TransactionClient | any;
