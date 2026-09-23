import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class CertificateRepository {
  public async findByDonationId(donationId: bigint) {
    return prisma.certificate.findUnique({
      where: { donation_id: donationId },
      include: { donation: true }
    });
  }

  public async createCertificate(tx: Prisma.TransactionClient, data: {
    donation_id: bigint;
    certificate_number: string;
    status: 'GENERATING' | 'GENERATED' | 'FAILED';
    generated_at?: Date;
  }) {
    return tx.certificate.create({
      data: {
        donation_id: data.donation_id,
        certificate_number: data.certificate_number,
        status: data.status,
        generated_at: data.generated_at
      }
    });
  }
}

export const certificateRepository = new CertificateRepository();
