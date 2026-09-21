import { razorpayService } from '../../src/modules/payments/razorpay.service';
import { env } from '../../src/config/env';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';

// Mock Razorpay
jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => {
    return {
      orders: {
        create: jest.fn(),
        fetch: jest.fn()
      },
      payments: {
        fetch: jest.fn()
      }
    };
  });
});

describe('RazorpayService', () => {
  let razorpayInstance: any;

  beforeAll(() => {
    razorpayInstance = (razorpayService as any).instance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder (Amount Validation & Conversion)', () => {
    it('should create an order successfully (100 INR -> 10000 paise)', async () => {
      razorpayInstance.orders.create.mockResolvedValueOnce({ id: 'order_test_123' });
      await razorpayService.createOrder({
        amount: new Prisma.Decimal('100'),
        currency: 'INR',
        receipt: 'receipt_123'
      });
      expect(razorpayInstance.orders.create).toHaveBeenCalledWith(expect.objectContaining({ amount: 10000 }));
    });

    it('should correctly convert 100.50 INR -> 10050 paise', async () => {
      razorpayInstance.orders.create.mockResolvedValueOnce({ id: 'order_test_123' });
      await razorpayService.createOrder({
        amount: new Prisma.Decimal('100.50'),
        currency: 'INR',
        receipt: 'receipt_123'
      });
      expect(razorpayInstance.orders.create).toHaveBeenCalledWith(expect.objectContaining({ amount: 10050 }));
    });

    it('should correctly convert 999.99 INR -> 99999 paise', async () => {
      razorpayInstance.orders.create.mockResolvedValueOnce({ id: 'order_test_123' });
      await razorpayService.createOrder({
        amount: new Prisma.Decimal('999.99'),
        currency: 'INR',
        receipt: 'receipt_123'
      });
      expect(razorpayInstance.orders.create).toHaveBeenCalledWith(expect.objectContaining({ amount: 99999 }));
    });

    it('should correctly convert 100000.01 INR -> 10000001 paise', async () => {
      razorpayInstance.orders.create.mockResolvedValueOnce({ id: 'order_test_123' });
      await razorpayService.createOrder({
        amount: new Prisma.Decimal('100000.01'),
        currency: 'INR',
        receipt: 'receipt_123'
      });
      expect(razorpayInstance.orders.create).toHaveBeenCalledWith(expect.objectContaining({ amount: 10000001 }));
    });

    it('should reject negative amount', async () => {
      const params = { amount: new Prisma.Decimal('-500'), currency: 'INR', receipt: 'r' };
      await expect(razorpayService.createOrder(params)).rejects.toThrow('Invalid amount');
    });

    it('should reject zero amount', async () => {
      const params = { amount: new Prisma.Decimal('0'), currency: 'INR', receipt: 'r' };
      await expect(razorpayService.createOrder(params)).rejects.toThrow('Invalid amount');
    });

    it('should reject invalid/NaN amount', async () => {
      const params = { amount: new Prisma.Decimal('NaN'), currency: 'INR', receipt: 'r' };
      await expect(razorpayService.createOrder(params)).rejects.toThrow('Invalid amount');
    });

    it('should throw AppError if currency is not INR', async () => {
      const params = { amount: new Prisma.Decimal('100.50'), currency: 'USD', receipt: 'r' };
      await expect(razorpayService.createOrder(params)).rejects.toThrow('Currency must be INR');
    });

    it('should handle Razorpay API failures safely without exposing secrets', async () => {
      razorpayInstance.orders.create.mockRejectedValueOnce(new Error('Razorpay Secret Error: secret_key_123'));
      const params = { amount: new Prisma.Decimal('100.50'), currency: 'INR', receipt: 'r' };
      await expect(razorpayService.createOrder(params)).rejects.toThrow('Failed to create Razorpay order');
    });
  });

  describe('fetchOrder', () => {
    it('should fetch an order successfully', async () => {
      const mockOrder = { id: 'order_test_123' };
      razorpayInstance.orders.fetch.mockResolvedValueOnce(mockOrder);
      const result = await razorpayService.fetchOrder('order_test_123');
      expect(result).toEqual(mockOrder);
    });

    it('should handle fetch order failure safely', async () => {
      razorpayInstance.orders.fetch.mockRejectedValueOnce(new Error('Network error'));
      await expect(razorpayService.fetchOrder('order_test_123')).rejects.toThrow('Failed to fetch Razorpay order');
    });
  });

  describe('fetchPayment', () => {
    it('should fetch a payment successfully', async () => {
      const mockPayment = { id: 'pay_test_123' };
      razorpayInstance.payments.fetch.mockResolvedValueOnce(mockPayment);
      const result = await razorpayService.fetchPayment('pay_test_123');
      expect(result).toEqual(mockPayment);
    });

    it('should handle fetch payment failure safely', async () => {
      razorpayInstance.payments.fetch.mockRejectedValueOnce(new Error('Network error'));
      await expect(razorpayService.fetchPayment('pay_test_123')).rejects.toThrow('Failed to fetch Razorpay payment');
    });
  });

  describe('verifyCheckoutSignature', () => {
    const orderId = 'order_test_123';
    const paymentId = 'pay_test_123';
    const validSignature = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');

    it('should return true for a valid signature', () => {
      expect(razorpayService.verifyCheckoutSignature({ orderId, paymentId, signature: validSignature })).toBe(true);
    });

    it('should return false for wrong order ID', () => {
      expect(razorpayService.verifyCheckoutSignature({ orderId: 'wrong_order', paymentId, signature: validSignature })).toBe(false);
    });

    it('should return false for wrong payment ID', () => {
      expect(razorpayService.verifyCheckoutSignature({ orderId, paymentId: 'wrong_pay', signature: validSignature })).toBe(false);
    });

    it('should return false for malformed/invalid signature', () => {
      const malformedSignature = validSignature.replace('a', 'b').replace('1', '2');
      expect(razorpayService.verifyCheckoutSignature({ orderId, paymentId, signature: malformedSignature })).toBe(false);
    });

    it('should safely return false for different-length signature without throwing TypeError', () => {
      const diffLengthSignature = validSignature + 'extra_bytes';
      expect(() => razorpayService.verifyCheckoutSignature({ orderId, paymentId, signature: diffLengthSignature })).not.toThrow();
      expect(razorpayService.verifyCheckoutSignature({ orderId, paymentId, signature: diffLengthSignature })).toBe(false);
    });

    it('should return false for empty signature', () => {
      expect(razorpayService.verifyCheckoutSignature({ orderId, paymentId, signature: '' })).toBe(false);
    });
  });

  describe('verifyWebhookSignature', () => {
    const rawBody = JSON.stringify({ event: 'order.paid' });
    const validSignature = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');

    it('should return true for a valid webhook signature', () => {
      expect(razorpayService.verifyWebhookSignature(rawBody, validSignature)).toBe(true);
    });

    it('should return false for an invalid/malformed webhook signature', () => {
      const malformedSignature = validSignature.replace('a', 'b').replace('1', '2');
      expect(razorpayService.verifyWebhookSignature(rawBody, malformedSignature)).toBe(false);
    });

    it('should safely return false for different-length signature without throwing TypeError', () => {
      const diffLengthSignature = validSignature + 'extra_bytes';
      expect(() => razorpayService.verifyWebhookSignature(rawBody, diffLengthSignature)).not.toThrow();
      expect(razorpayService.verifyWebhookSignature(rawBody, diffLengthSignature)).toBe(false);
    });

    it('should return false if raw body is modified', () => {
      const modifiedBody = JSON.stringify({ event: 'order.failed' });
      expect(razorpayService.verifyWebhookSignature(modifiedBody, validSignature)).toBe(false);
    });
    
    it('should return false for empty signature', () => {
      expect(razorpayService.verifyWebhookSignature(rawBody, '')).toBe(false);
    });
  });
});
