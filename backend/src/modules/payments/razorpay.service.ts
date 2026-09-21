import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../../config/env';
import { CreateOrderParams, RazorpayOrder, RazorpayPayment, VerifySignatureParams } from './razorpay.types';
import { AppError } from '../../utils/errors';

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

      const order = await this.instance.orders.create(options);
      return order as RazorpayOrder;
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
}

export const razorpayService = new RazorpayService();
