import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import { donorService } from '../donors/donor.service';
import { NumberSequenceService } from '../../services/number-sequence/number-sequence.service';
import { donationRepository } from './donation.repository';
import { CreateOfflineDonationDTO, CreateOnlineDonationDTO, VerifyOnlineDonationDTO, ProcessSuccessfulPaymentParams, AuditContext, DonationSearchQuery } from './donation.types';
import { Prisma } from '@prisma/client';
import { razorpayService } from '../payments/razorpay.service';
import { appEventEmitter } from '../../events/event-emitter';
import { DonationEvents } from '../../events/donation.events';

export class DonationService {
  /**
   * Safe mapping for external response
   */
  public mapDonationResponse(donation: any) {
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
        id: donation.campaign.id.toString(),
        category_id: donation.campaign.category_id ? donation.campaign.category_id.toString() : undefined,
        featured_image_id: donation.campaign.featured_image_id ? donation.campaign.featured_image_id.toString() : null,
        raised_amount: donation.campaign.raised_amount ? donation.campaign.raised_amount.toString() : '0',
        target_amount: donation.campaign.target_amount ? donation.campaign.target_amount.toString() : null
      } : undefined
    };
  }

  /**
   * Create Offline Donation (Admin / Authenticated)
   */
  public async createOfflineDonation(data: CreateOfflineDonationDTO, auditContext: AuditContext) {
    return prisma.$transaction(async (tx) => {
      // 1. Resolve or Create Donor
      const { donor } = await donorService.resolveOrCreateWithTransaction(tx, data.donor as any, auditContext);
      const donorId = BigInt(donor.id);

      // 2. Generate Next Donation Number
      const year = new Date().getFullYear();
      const donationNumber = await NumberSequenceService.next(tx, 'DONATION', year);

      // 3. Create Donation Record
      const donation = await donationRepository.createDonation(tx, {
        donation_number: donationNumber,
        donor_id: donorId,
        campaign_id: data.campaign_id ? BigInt(data.campaign_id) : null,
        created_by_id: auditContext.actorUserId || null,
        amount: new Prisma.Decimal(data.amount),
        payment_type: data.payment_type,
        status: 'PENDING',
        is_anonymous: data.is_anonymous || false,
        donor_message: data.donor_message,
        notes: data.notes
      });

      // 4. Create Initial Payment Record
      const payment = await donationRepository.createPayment(tx, {
        donation_id: donation.id,
        amount: new Prisma.Decimal(data.amount),
        provider: 'MANUAL',
        status: 'CREATED'
      });

      // 5. Audit Log (DONATION_CREATED)
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
            payment_type: donation.payment_type,
            status: donation.status
          } as any
        }
      });

      // Include payment in the returned donation
      (donation as any).payments = [payment];

      return this.mapDonationResponse(donation);
    });
  }

  /**
   * Create Online Donation (Phase B)
   */
  public async createOnlineDonation(data: CreateOnlineDonationDTO, auditContext: AuditContext) {
    // 1. Check idempotency
    const existing = await prisma.donation.findUnique({
      where: { idempotency_key: data.idempotency_key },
      include: { payments: true, donor: true }
    });

    let donation;
    let payment;
    const requestedAmount = new Prisma.Decimal(data.amount);

    if (existing) {
      // 2. Validate payload matching
      if (
        !existing.amount.equals(requestedAmount) ||
        existing.is_anonymous !== (data.is_anonymous || false) ||
        (existing.campaign_id?.toString() || undefined) !== (data.campaign_id?.toString() || undefined) ||
        existing.donor.first_name !== data.donor.first_name ||
        (existing.donor.email || '') !== (data.donor.email || '') ||
        (existing.donor.phone || '') !== (data.donor.phone || '')
      ) {
        throw new AppError('Idempotency key already used with materially different payload', 409);
      }

      donation = existing;
      payment = existing.payments[0];

      if (payment.provider_order_id) {
        return {
          donation: this.mapDonationResponse(donation),
          isNew: false
        };
      }
    } else {
      // 3. Create Intent (Internal Transaction)
      const intentResult = await prisma.$transaction(async (tx) => {
        const { donor } = await donorService.resolveOrCreateWithTransaction(tx, data.donor as any, auditContext);
        const donorId = BigInt(donor.id);
        const year = new Date().getFullYear();
        const donationNumber = await NumberSequenceService.next(tx, 'DONATION', year);

        const newDonation = await donationRepository.createDonation(tx, {
          donation_number: donationNumber,
          idempotency_key: data.idempotency_key,
          donor_id: donorId,
          campaign_id: data.campaign_id ? BigInt(data.campaign_id) : null,
          created_by_id: auditContext.actorUserId || null,
          amount: requestedAmount,
          payment_type: 'ONLINE',
          status: 'PENDING',
          is_anonymous: data.is_anonymous || false,
          donor_message: data.donor_message
        });

        const newPayment = await donationRepository.createPayment(tx, {
          donation_id: newDonation.id,
          amount: requestedAmount,
          provider: 'RAZORPAY',
          status: 'CREATED'
        });

        await tx.auditLog.create({
          data: {
            action: 'DONATION_CREATED',
            entity_type: 'DONATION',
            entity_id: newDonation.id,
            user_id: auditContext.actorUserId || null,
            ip_address: auditContext.ipAddress,
            user_agent: auditContext.userAgent,
            new_values: {
              donation_number: newDonation.donation_number,
              idempotency_key: data.idempotency_key,
              amount: newDonation.amount.toString()
            } as any
          }
        });

        (newDonation as any).payments = [newPayment];

        return {
          donation: newDonation,
          payment: newPayment
        };
      });

      donation = intentResult.donation!;
      payment = intentResult.payment;
    }

    // 4. Razorpay Orchestration (Outside Transaction)
    if (!payment.provider_order_id) {
      const order = await razorpayService.createOrder({
        amount: donation.amount,
        currency: 'INR',
        receipt: donation.donation_number
      });

      // 5. Compare-And-Set (CAS) to atomically persist provider_order_id
      const updateResult = await prisma.payment.updateMany({
        where: {
          id: payment.id,
          provider_order_id: null
        },
        data: {
          provider_order_id: order.id,
          updated_at: new Date()
        }
      });

      if (updateResult.count === 0) {
        // Another thread won the CAS
        const updatedPayment = await prisma.payment.findUnique({ where: { id: payment.id } });
        payment = updatedPayment!;
        (donation as any).payments[0] = payment;
      } else {
        // We won the CAS
        payment.provider_order_id = order.id;
        (donation as any).payments[0] = payment;
      }
    }

    return {
      donation: this.mapDonationResponse(donation),
      isNew: !existing
    };
  }

  /**
   * Process Successful Payment (Phase C)
   * Single centralized method for both checkout verification and webhook processing.
   */
  public async processSuccessfulPayment(params: ProcessSuccessfulPaymentParams) {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch payment and donation
      const payment = await tx.payment.findUnique({
        where: { id: params.paymentId },
        include: { donation: true }
      });

      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      const donation = payment.donation;

      // 2. Check if already SUCCESS + CAPTURED (Idempotent return)
      if (donation.status === 'SUCCESS' && payment.status === 'CAPTURED') {
        if (params.webhookEventId) {
          await tx.paymentWebhookEvent.update({
            where: { id: params.webhookEventId },
            data: {
              processing_state: 'PROCESSED',
              processed_at: new Date()
            }
          });
        }
        const updatedDonation = await tx.donation.findUnique({
          where: { id: donation.id },
          include: { donor: true, campaign: true, payments: true }
        });
        return {
          donation: this.mapDonationResponse(updatedDonation!),
          alreadyProcessed: true
        };
      }

      // Validate states
      if (donation.status !== 'PENDING') {
        throw new AppError(`Donation cannot be confirmed from status ${donation.status}`, 400);
      }
      if (payment.provider !== 'RAZORPAY') {
        throw new AppError('Invalid payment provider', 400);
      }
      if (payment.status === 'FAILED') {
        throw new AppError('Cannot confirm a failed payment', 400);
      }

      // 3. Atomically update Donation: PENDING -> SUCCESS
      const affectedRows = await donationRepository.confirmDonation(tx, donation.id);

      if (affectedRows === 0) {
        // Concurrency follower: check if another worker already transitioned it to SUCCESS
        const currentDonation = await tx.donation.findUnique({
          where: { id: donation.id },
          include: { donor: true, campaign: true, payments: true }
        });

        if (currentDonation?.status === 'SUCCESS') {
          if (params.webhookEventId) {
            await tx.paymentWebhookEvent.update({
              where: { id: params.webhookEventId },
              data: {
                processing_state: 'PROCESSED',
                processed_at: new Date()
              }
            });
          }
          return {
            donation: this.mapDonationResponse(currentDonation),
            alreadyProcessed: true
          };
        }

        throw new AppError('Failed to transition donation state', 400);
      }

      // 4. Update Payment to CAPTURED
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'CAPTURED',
          provider_payment_id: params.providerPaymentId,
          method: params.paymentMethod || null,
          updated_at: new Date()
        }
      });

      // 5. Campaign Increment (Atomic)
      if (donation.campaign_id) {
        await donationRepository.incrementCampaign(tx, donation.campaign_id, donation.amount);
      }

      // 6. Audit Log (DONATION_CONFIRMED)
      await tx.auditLog.create({
        data: {
          action: 'DONATION_CONFIRMED',
          entity_type: 'DONATION',
          entity_id: donation.id,
          user_id: params.auditContext.actorUserId || null,
          ip_address: params.auditContext.ipAddress,
          user_agent: params.auditContext.userAgent,
          old_values: {
            status: 'PENDING',
            payment_status: payment.status
          } as any,
          new_values: {
            status: 'SUCCESS',
            payment_status: 'CAPTURED',
            provider_payment_id: params.providerPaymentId,
            method: params.paymentMethod || null
          } as any
        }
      });

      // 7. If webhookEventId exists, mark PaymentWebhookEvent PROCESSED
      if (params.webhookEventId) {
        await tx.paymentWebhookEvent.update({
          where: { id: params.webhookEventId },
          data: {
            processing_state: 'PROCESSED',
            processed_at: new Date()
          }
        });
      }

      // 8. Return final updated donation
      const updatedDonation = await tx.donation.findUnique({
        where: { id: donation.id },
        include: { donor: true, campaign: true, payments: true }
      });

      return {
        donation: this.mapDonationResponse(updatedDonation!),
        alreadyProcessed: false
      };
    });

    if (!result.alreadyProcessed) {
      appEventEmitter.emit(DonationEvents.DONATION_SUCCESS, {
        donationId: BigInt(result.donation.id)
      });
    }

    return result;
  }

  /**
   * Verify Online Donation Checkout (Phase C)
   */
  public async verifyOnlineDonation(data: VerifyOnlineDonationDTO, auditContext: AuditContext) {
    // 1. Find internal Payment by provider_order_id
    const payment = await donationRepository.findPaymentByProviderOrderId(data.razorpay_order_id);
    if (!payment) {
      throw new AppError('Donation payment intent not found', 404);
    }

    const donation = payment.donation;

    // 2. If already SUCCESS + CAPTURED, return idempotently
    if (donation.status === 'SUCCESS' && payment.status === 'CAPTURED') {
      return this.mapDonationResponse(donation);
    }

    // 3. Verify checkout HMAC signature using trusted stored provider_order_id
    const isValidSignature = razorpayService.verifyCheckoutSignature({
      orderId: payment.provider_order_id!,
      paymentId: data.razorpay_payment_id,
      signature: data.razorpay_signature
    });

    if (!isValidSignature) {
      throw new AppError('Invalid payment signature', 400);
    }

    // 4. Fetch payment from Razorpay SDK
    const fetchedPayment = await razorpayService.fetchPayment(data.razorpay_payment_id);

    // 5. Verify provider payment state
    if (fetchedPayment.order_id !== payment.provider_order_id) {
      throw new AppError('Payment order ID mismatch with provider', 400);
    }

    if (fetchedPayment.currency !== 'INR') {
      throw new AppError('Payment currency must be INR', 400);
    }

    const expectedAmountPaise = Math.round(Number(payment.amount) * 100);
    if (fetchedPayment.amount !== expectedAmountPaise) {
      throw new AppError('Payment amount mismatch with provider', 400);
    }

    if (fetchedPayment.status !== 'captured') {
      throw new AppError(`Payment is not in captured state (status: ${fetchedPayment.status})`, 400);
    }

    // 6. Call centralized success transition
    const result = await this.processSuccessfulPayment({
      paymentId: payment.id,
      providerPaymentId: data.razorpay_payment_id,
      paymentMethod: fetchedPayment.method,
      auditContext
    });

    return result.donation;
  }

  /**
   * Confirm Offline Donation
   */
  public async confirmDonation(id: bigint, auditContext: AuditContext) {
    const result = await prisma.$transaction(async (tx) => {
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

    appEventEmitter.emit(DonationEvents.DONATION_SUCCESS, {
      donationId: id
    });

    return result;
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
