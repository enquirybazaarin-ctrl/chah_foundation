import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import { NumberSequenceService } from '../../services/number-sequence/number-sequence.service';
import { certificateRepository } from './certificate.repository';

export class CertificateService {
  /**
   * Generates a certificate idempotently for a given donation.
   */
  public async generateCertificate(donationId: bigint) {
    // 1. Check if certificate already exists
    const existing = await certificateRepository.findByDonationId(donationId);
    if (existing) {
      return existing;
    }

    return prisma.$transaction(async (tx) => {
      // Re-check within transaction for concurrent safety
      const txExisting = await tx.certificate.findUnique({
        where: { donation_id: donationId }
      });
      if (txExisting) {
        return txExisting;
      }

      // Verify donation exists and is successful
      const donation = await tx.donation.findUnique({
        where: { id: donationId },
        include: { donor: true }
      });

      if (!donation) {
        throw new AppError('Donation not found', 404);
      }
      
      if (donation.status !== 'SUCCESS') {
        throw new AppError('Cannot generate certificate for a non-successful donation', 400);
      }

      // 2. Generate unique certificate number
      const year = new Date().getFullYear();
      const certificateNumber = await NumberSequenceService.next(tx, 'CERTIFICATE', year);

      // 3. Create Certificate record
      const certificate = await certificateRepository.createCertificate(tx, {
        donation_id: donationId,
        certificate_number: certificateNumber,
        status: 'GENERATED',
        generated_at: new Date()
      });

      return certificate;
    });
  }
}

export const certificateService = new CertificateService();
