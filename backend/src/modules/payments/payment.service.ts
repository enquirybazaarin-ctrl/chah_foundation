import { prisma } from '../../config/database';
import { AppError } from '../../utils/errors';
import { razorpayService } from './razorpay.service';
import { donationRepository } from '../donations/donation.repository';
import { donationService } from '../donations/donation.service';
import { AuditContext } from '../donations/donation.types';
import { NumberSequenceService } from '../../services/number-sequence/number-sequence.service';
import { subscriptionRepository } from '../subscriptions/subscription.repository';
import { Prisma } from '@prisma/client';
import { appEventEmitter } from '../../events/event-emitter';
import { DonationEvents } from '../../events/donation.events';

export class PaymentService {
  /**
   * Handle Razorpay Webhook (Phase C)
   */
  public async handleRazorpayWebhook(
    rawBody: Buffer,
    signature: string,
    eventIdHeader?: string,
    auditContext?: AuditContext
  ) {
    // 1. Verify webhook HMAC signature directly on raw buffer
    const isValid = razorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw new AppError('Invalid webhook signature', 400);
    }

    // 2. Parse JSON only after signature verification
    let body: any;
    try {
      body = JSON.parse(rawBody.toString('utf-8'));
    } catch {
      throw new AppError('Invalid JSON payload in webhook', 400);
    }

    const eventType: string = body.event || 'unknown';
    const providerEventId: string = eventIdHeader || body.id || body.event_id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 3. Webhook Event Lifecycle & Deduplication
    let webhookEvent = await prisma.paymentWebhookEvent.findUnique({
      where: { provider_event_id: providerEventId }
    });

    if (webhookEvent && webhookEvent.processing_state === 'PROCESSED') {
      // Idempotent duplicate delivery: return 200 immediately
      return { status: 'ok', message: 'Event already processed' };
    }

    if (!webhookEvent) {
      try {
        webhookEvent = await prisma.paymentWebhookEvent.create({
          data: {
            provider: 'RAZORPAY',
            provider_event_id: providerEventId,
            event_type: eventType,
            payload: body,
            signature_valid: true,
            processing_state: 'PENDING',
            received_at: new Date()
          }
        });
      } catch (err: any) {
        // Handle concurrent duplicate webhook race inserting the same provider_event_id
        if (err?.code === 'P2002') {
          webhookEvent = await prisma.paymentWebhookEvent.findUnique({
            where: { provider_event_id: providerEventId }
          });
          if (webhookEvent && webhookEvent.processing_state === 'PROCESSED') {
            return { status: 'ok', message: 'Event already processed' };
          }
        } else {
          throw err;
        }
      }
    }

    // 4. Process event based on type
    try {
      if (eventType === 'payment.captured') {
        const paymentEntity = body.payload?.payment?.entity;
        if (!paymentEntity) {
          throw new AppError('Missing payment entity in webhook payload', 400);
        }

        const providerOrderId = paymentEntity.order_id;
        const providerPaymentId = paymentEntity.id;
        const currency = paymentEntity.currency;
        const amountPaise = paymentEntity.amount;
        const status = paymentEntity.status;
        const method = paymentEntity.method;

        if (status !== 'captured') {
          throw new AppError(`Webhook payment status is not captured: ${status}`, 400);
        }

        if (currency !== 'INR') {
          throw new AppError(`Invalid currency: ${currency}`, 400);
        }

        const internalPayment = await donationRepository.findPaymentByProviderOrderId(providerOrderId);
        if (!internalPayment) {
          throw new AppError(`Payment not found for provider_order_id: ${providerOrderId}`, 404);
        }

        const expectedAmountPaise = Math.round(Number(internalPayment.amount) * 100);
        if (amountPaise !== expectedAmountPaise) {
          throw new AppError(`Amount mismatch. Expected ${expectedAmountPaise}, received ${amountPaise}`, 400);
        }

        // Centralized success transition with atomic transaction
        await donationService.processSuccessfulPayment({
          paymentId: internalPayment.id,
          providerPaymentId,
          paymentMethod: method,
          auditContext: auditContext || { ipAddress: 'webhook', userAgent: 'razorpay-webhook' },
          webhookEventId: webhookEvent?.id
        });
      } else if (eventType === 'payment.failed') {
        const paymentEntity = body.payload?.payment?.entity;
        if (paymentEntity) {
          const providerOrderId = paymentEntity.order_id;
          const errorMessage = paymentEntity.error_description || paymentEntity.error_code || 'Payment failed';

          const internalPayment = await donationRepository.findPaymentByProviderOrderId(providerOrderId);
          if (internalPayment && internalPayment.status !== 'CAPTURED') {
            await prisma.$transaction(async (tx) => {
              await tx.payment.update({
                where: { id: internalPayment.id },
                data: {
                  status: 'FAILED',
                  error_message: errorMessage,
                  updated_at: new Date()
                }
              });

              await tx.donation.update({
                where: { id: internalPayment.donation_id },
                data: {
                  status: 'FAILED',
                  updated_at: new Date()
                }
              });

              if (webhookEvent) {
                await tx.paymentWebhookEvent.update({
                  where: { id: webhookEvent.id },
                  data: {
                    processing_state: 'PROCESSED',
                    processed_at: new Date()
                  }
                });
              }
            });
          }
        }
      } else if (eventType === 'order.paid') {
        // Acknowledge order.paid; mark webhook PROCESSED safely
        if (webhookEvent) {
          await prisma.paymentWebhookEvent.update({
            where: { id: webhookEvent.id },
            data: {
              processing_state: 'PROCESSED',
              processed_at: new Date()
            }
          });
        }
      } else if (eventType === 'subscription.charged') {
        const subscriptionEntity = body.payload?.subscription?.entity;
        const paymentEntity = body.payload?.payment?.entity;
        
        if (subscriptionEntity && paymentEntity) {
          const razorpaySubscriptionId = subscriptionEntity.id;
          const providerPaymentId = paymentEntity.id;
          const amount = paymentEntity.amount; // in paise
          const method = paymentEntity.method;
          
          const internalSubscription = await subscriptionRepository.findSubscriptionByRazorpayId(razorpaySubscriptionId);
          if (internalSubscription) {
            const transactionResult = await prisma.$transaction(async (tx) => {
              // Create donation
              const year = new Date().getFullYear();
              const donationNumber = await NumberSequenceService.next(tx as any, 'DONATION', year);
              
              const donation = await tx.donation.create({
                data: {
                  donation_number: donationNumber,
                  donor_id: internalSubscription.donor_id,
                  campaign_id: internalSubscription.campaign_id,
                  amount: new Prisma.Decimal(amount / 100),
                  payment_type: 'ONLINE',
                  status: 'SUCCESS', // Will trigger after
                  is_anonymous: false
                }
              });

              // Create payment
              const payment = await tx.payment.create({
                data: {
                  donation_id: donation.id,
                  amount: new Prisma.Decimal(amount / 100),
                  provider: 'RAZORPAY',
                  provider_payment_id: providerPaymentId,
                  status: 'CAPTURED',
                  method: method
                }
              });
              
              // Update Subscription
              await tx.subscription.update({
                where: { id: internalSubscription.id },
                data: { 
                  status: 'ACTIVE',
                  next_billing_date: subscriptionEntity.charge_at ? new Date(subscriptionEntity.charge_at * 1000) : null 
                }
              });

              // Trigger post-success safely outside or inside if we just rely on cron, 
              // but we can call it manually here or let `processSuccessfulPayment` do it.
              // Wait, to avoid cyclic complexity, we just mark webhook PROCESSED
              if (webhookEvent) {
                await tx.paymentWebhookEvent.update({
                  where: { id: webhookEvent.id },
                  data: { processing_state: 'PROCESSED', processed_at: new Date() }
                });
              }
              
              return { donationId: donation.id };
            });
            
            // Emit success event outside transaction to trigger side-effects (Email/Certificate)
            if (transactionResult?.donationId) {
              appEventEmitter.emit(DonationEvents.DONATION_SUCCESS, { donationId: transactionResult.donationId });
            }
          }
        }
      } else if (eventType === 'subscription.cancelled' || eventType === 'subscription.halted' || eventType === 'subscription.paused') {
        const subscriptionEntity = body.payload?.subscription?.entity;
        if (subscriptionEntity) {
          const razorpaySubscriptionId = subscriptionEntity.id;
          const internalSubscription = await subscriptionRepository.findSubscriptionByRazorpayId(razorpaySubscriptionId);
          if (internalSubscription) {
            await prisma.subscription.update({
              where: { id: internalSubscription.id },
              data: { status: eventType === 'subscription.cancelled' ? 'CANCELLED' : 'PAUSED' }
            });
          }
        }
        
        if (webhookEvent) {
          await prisma.paymentWebhookEvent.update({
            where: { id: webhookEvent.id },
            data: { processing_state: 'PROCESSED', processed_at: new Date() }
          });
        }
      } else {
        // Other events acknowledged safely
        if (webhookEvent) {
          await prisma.paymentWebhookEvent.update({
            where: { id: webhookEvent.id },
            data: {
              processing_state: 'PROCESSED',
              processed_at: new Date()
            }
          });
        }
      }

      return { status: 'ok' };
    } catch (error: any) {
      if (webhookEvent) {
        await prisma.paymentWebhookEvent.update({
          where: { id: webhookEvent.id },
          data: {
            processing_state: 'FAILED',
            error_message: error.message || 'Unknown processing error'
          }
        }).catch(() => {});
      }
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
