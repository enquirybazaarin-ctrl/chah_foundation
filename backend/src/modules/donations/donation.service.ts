import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import { donorService } from '../donors/donor.service';
import { NumberSequenceService } from '../../services/number-sequence/number-sequence.service';
import { donationRepository } from './donation.repository';
import { CreateOfflineDonationDTO, AuditContext, DonationSearchQuery } from './donation.types';
import { Prisma } from '@prisma/client';

export class DonationService {
  /**
   * Safe mapping for external response
   */
  private mapDonationResponse(donation: any) {
    return {
      ...donation,
      id: donation.id.toString(),
      donor_id: donation.donor_id.toString(),
      campaign_id: donation.campaign_id?.toString() || null,
      created_by_id: donation.created_by_id?.toString() || null,
      amount: donation.amount.toString(),
      payments: donation.payments?.map((p: any) => ({
        ...p,
        id: p.id.toString(),
        donation_id: p.donation_id.toString(),
        amount: p.amount.toString()
      })) || [],
      donor: donation.donor ? {
        ...donation.donor,
        id: donation.donor.id.toString()
      } : undefined,
      campaign: donation.campaign ? {
        ...donation.campaign,
        id: donation.campaign.id.toString()
      } : undefined
    };
  }

  /**
   * Create Offline Donation
   */
  public async createOfflineDonation(data: CreateOfflineDonationDTO, auditContext: AuditContext) {
    return prisma.$transaction(async (tx) => {
      // 1. Resolve or Create Donor atomically
      const { donor } = await donorService.resolveOrCreateWithTransaction(tx, data.donor as any, auditContext);
      
      const donorId = BigInt(donor.id);
      const amount = new Prisma.Decimal(data.amount);
      const year = new Date().getFullYear();

      // 2. Generate DONATION Number
      const donationNumber = await NumberSequenceService.next(tx, 'DONATION', year);

      // 3. Create Donation (PENDING)
      const donation = await donationRepository.createDonation(tx, {
        donation_number: donationNumber,
        donor_id: donorId,
        campaign_id: data.campaign_id ? BigInt(data.campaign_id) : null,
        created_by_id: auditContext.actorUserId || null,
        amount,
        payment_type: data.payment_type,
        status: 'PENDING',
        is_anonymous: data.is_anonymous || false,
        donor_message: data.donor_message,
        notes: data.notes
      });

      // 4. Create Payment (CREATED, MANUAL)
      const payment = await donationRepository.createPayment(tx, {
        donation_id: donation.id,
        amount,
        provider: 'MANUAL',
        status: 'CREATED'
      });
      (donation as any).payments = [payment];

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          action: 'DONATION_CREATED',
          entity_type: 'DONATION',
          entity_id: donation.id,
          user_id: auditContext.actorUserId || null,
          ip_address: auditContext.ipAddress,
          user_agent: auditContext.userAgent,
          new_values: {
            donation_number: donation.donation_number,
            amount: donation.amount.toString(),
            status: donation.status,
            donor_id: donor.id
          } as any
        }
      });

      return this.mapDonationResponse(donation);
    });
  }

  /**
   * Confirm Offline Donation
   */
  public async confirmDonation(id: bigint, auditContext: AuditContext) {
    return prisma.$transaction(async (tx) => {
      const donation = await tx.donation.findUnique({
        where: { id }
      });

      if (!donation) {
        throw new AppError('Donation not found', 404);
      }

      // Atomic transition
      const affectedRows = await donationRepository.confirmDonation(tx, id);
      
      if (affectedRows !== 1) {
        throw new AppError('Donation could not be confirmed. It may not be in PENDING state or was already processed.', 400);
      }

      // Capture Payment
      await donationRepository.capturePayment(tx, id);

      // Increment Campaign if exists
      if (donation.campaign_id) {
        await donationRepository.incrementCampaign(tx, donation.campaign_id, donation.amount);
      }

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: 'DONATION_CONFIRMED',
          entity_type: 'DONATION',
          entity_id: id,
          user_id: auditContext.actorUserId || null,
          ip_address: auditContext.ipAddress,
          user_agent: auditContext.userAgent,
          old_values: { status: 'PENDING' } as any,
          new_values: { status: 'SUCCESS' } as any
        }
      });

      const updated = await tx.donation.findUnique({ where: { id }, include: { payments: true } });
      return this.mapDonationResponse(updated);
    });
  }

  /**
   * Cancel Donation
   */
  public async cancelDonation(id: bigint, auditContext: AuditContext) {
    return prisma.$transaction(async (tx) => {
      const affectedRows = await donationRepository.cancelDonation(tx, id);
      
      if (affectedRows !== 1) {
        throw new AppError('Donation could not be cancelled. Only PENDING donations can be cancelled.', 400);
      }

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: 'DONATION_CANCELLED',
          entity_type: 'DONATION',
          entity_id: id,
          user_id: auditContext.actorUserId || null,
          ip_address: auditContext.ipAddress,
          user_agent: auditContext.userAgent,
          old_values: { status: 'PENDING' } as any,
          new_values: { status: 'CANCELLED' } as any
        }
      });

      const updated = await tx.donation.findUnique({ where: { id }, include: { payments: true } });
      return this.mapDonationResponse(updated);
    });
  }

  /**
   * Search Donations
   */
  public async searchDonations(query: DonationSearchQuery) {
    const result = await donationRepository.search(query);
    return {
      data: result.data.map(d => this.mapDonationResponse(d)),
      meta: {
        total: result.total,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        total_pages: Math.ceil(result.total / (Number(query.limit) || 10))
      }
    };
  }

  /**
   * Get Donation by ID
   */
  public async getDonationById(id: bigint) {
    const donation = await donationRepository.findById(id);
    if (!donation) {
      throw new AppError('Donation not found', 404);
    }
    return this.mapDonationResponse(donation);
  }
}

export const donationService = new DonationService();
