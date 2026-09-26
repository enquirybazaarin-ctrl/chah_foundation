import api from './api';

export interface Certificate {
  id: string;
  donation_id: string;
  certificate_number: string;
  pdf_url: string | null;
  status: 'GENERATING' | 'GENERATED' | 'FAILED';
  generated_at: string | null;
  created_at: string;
  updated_at: string;
  donation?: {
    id: string;
    donation_number: string;
    amount: string;
    currency: string;
    donor: {
      id: string;
      first_name: string;
      last_name: string | null;
      email: string | null;
      pan_number: string | null;
    }
  }
}

export interface PaginatedCertificates {
  data: Certificate[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getCertificates(params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedCertificates> {
  const res = await api.get<{ status: string; data: { certificates: Certificate[]; meta: any } }>(
    '/api/v1/certificates',
    { params }
  );
  
  const { certificates, meta } = res.data.data;
  return {
    data: certificates,
    meta: {
      ...meta,
      totalPages: Math.ceil(meta.total / meta.limit)
    }
  };
}

export async function generateCertificate(donationId: string): Promise<Certificate> {
  const res = await api.post<{ status: string; data: Certificate }>(
    '/api/v1/certificates/generate',
    { donationId }
  );
  return res.data.data;
}
