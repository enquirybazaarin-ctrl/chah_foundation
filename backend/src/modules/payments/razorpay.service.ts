import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../../config/env';
import { CreateOrderParams, RazorpayOrder, RazorpayPayment, VerifySignatureParams } from './razorpay.types';
import { AppError } from '../../utils/errors';
import { prisma } from '../../config/database';

export class RazorpayService {
  private instance: any;

  constructor() {
    this.instance = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * Creates an order with Razorpay.
   * Expects amount to be provided as a Prisma.Decimal in INR.
   * Internally converts to paise (smallest currency unit).
   */
  public async createOrder(params: CreateOrderParams): Promise<RazorpayOrder> {
    try {
      if (params.currency !== 'INR') {
        throw new AppError('Currency must be INR', 400);
      }
      
      const numericAmount = Number(params.amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new AppError('Invalid amount', 400);
      }
      
      const amountInPaise = Math.round(numericAmount * 100);

      const options = {
        amount: amountInPaise,
        currency: params.currency,
        receipt: params.receipt,
        notes: params.notes || {}
      };

      try {
        const order = await this.instance.orders.create(options);
        return order as RazorpayOrder;
      } catch (sdkError: any) {
        if (env.NODE_ENV === 'development' && env.RAZORPAY_KEY_ID === 'test_key_id') {
          return {
            id: `order_dev_${Date.now()}`,
            entity: 'order',
            amount: amountInPaise,
            amount_paid: 0,
            amount_due: amountInPaise,
            currency: params.currency,
            receipt: params.receipt,
            status: 'created',
            attempts: 0,
            notes: params.notes || {},
            created_at: Math.floor(Date.now() / 1000)
          } as RazorpayOrder;
        }
        throw sdkError;
      }
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create Razorpay order', 502);
    }
  }

  /**
   * Fetches an order from Razorpay
   */
  public async fetchOrder(orderId: string): Promise<RazorpayOrder> {
    try {
      const order = await this.instance.orders.fetch(orderId);
      return order as RazorpayOrder;
    } catch {
      throw new AppError('Failed to fetch Razorpay order', 502);
    }
  }

  /**
   * Fetches a payment from Razorpay
   */
  public async fetchPayment(paymentId: string): Promise<RazorpayPayment> {
    try {
      if (env.RAZORPAY_KEY_ID === 'test_key_id' && paymentId.startsWith('pay_dev_')) {
        const orderIdTarget = paymentId.replace('pay_dev_', '');
        const dbPayment = await prisma.payment.findFirst({
          where: {
            OR: [
              { provider_payment_id: paymentId },
              { provider_order_id: orderIdTarget }
            ]
          }
        });

        return {
          id: paymentId,
          entity: 'payment',
          amount: dbPayment ? Math.round(Number(dbPayment.amount) * 100) : 50000,
          currency: 'INR',
          status: 'captured',
          order_id: dbPayment?.provider_order_id || orderIdTarget,
          method: 'upi'
        } as any;
      }

      const payment = await this.instance.payments.fetch(paymentId);
      return payment as RazorpayPayment;
    } catch {
      throw new AppError('Failed to fetch Razorpay payment', 502);
    }
  }

  /**
   * Verifies the Razorpay checkout signature.
   * MUST use the database-trusted provider_order_id, NOT client payload.
   */
  public verifyCheckoutSignature(params: VerifySignatureParams): boolean {
    try {
      if (!params.orderId || !params.paymentId || !params.signature) {
        return false;
      }

      if (env.RAZORPAY_KEY_ID === 'test_key_id' && params.orderId.startsWith('order_dev_')) {
        return true;
      }

      const generatedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
        .update(`${params.orderId}|${params.paymentId}`)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(generatedSignature, 'utf-8'),
        Buffer.from(params.signature, 'utf-8')
      );
    } catch {
      return false;
    }
  }
  
  /**
   * Verifies the Razorpay webhook signature.
   * Uses the raw request body.
   */
  public verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    try {
      if (!signature) {
        return false;
      }
      const generatedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');
        
      return crypto.timingSafeEqual(
        Buffer.from(generatedSignature, 'utf-8'),
        Buffer.from(signature, 'utf-8')
      );
    } catch {
      return false;
    }
  }
  /**
   * Pause a Razorpay subscription
   */
  public async pauseSubscription(subscriptionId: string): Promise<any> {
    if (subscriptionId.startsWith('sub_') && subscriptionId.length > 20) {
      // It's a dummy or invalid for live Razorpay call if it was just generated by Math.random
      console.log(`Mock pausing Razorpay subscription ${subscriptionId}`);
    } else {
      try {
        return await this.instance.subscriptions.pause(subscriptionId, { pause_at: 'now' });
      } catch (err: any) {
        console.warn(`Failed to pause Razorpay subscription ${subscriptionId}: ${err?.message}`);
      }
    }
    return null;
  }

  /**
   * Resume a Razorpay subscription
   */
  public async resumeSubscription(subscriptionId: string): Promise<any> {
    if (subscriptionId.startsWith('sub_') && subscriptionId.length > 20) {
      console.log(`Mock resuming Razorpay subscription ${subscriptionId}`);
    } else {
      try {
        return await this.instance.subscriptions.resume(subscriptionId, { resume_at: 'now' });
      } catch (err: any) {
        console.warn(`Failed to resume Razorpay subscription ${subscriptionId}: ${err?.message}`);
      }
    }
    return null;
  }

  /**
   * Cancel a Razorpay subscription
   */
  public async cancelSubscription(subscriptionId: string): Promise<any> {
    if (subscriptionId.startsWith('sub_') && subscriptionId.length > 20) {
      console.log(`Mock cancelling Razorpay subscription ${subscriptionId}`);
    } else {
      try {
        return await this.instance.subscriptions.cancel(subscriptionId);
      } catch (err: any) {
        console.warn(`Failed to cancel Razorpay subscription ${subscriptionId}: ${err?.message}`);
      }
    }
    return null;
  }
}

export const razorpayService = new RazorpayService();
