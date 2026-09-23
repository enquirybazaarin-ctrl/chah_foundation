export interface CreateCertificateDTO {
  donationId: bigint;
}

export interface CertificateResponse {
  id: string;
  donation_id: string;
  certificate_number: string;
  status: 'GENERATING' | 'GENERATED' | 'FAILED';
  generated_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
