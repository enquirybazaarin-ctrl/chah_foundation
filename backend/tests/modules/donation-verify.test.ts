import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { razorpayService } from '../../src/modules/payments/razorpay.service';
import crypto from 'crypto';
import { env } from '../../src/config/env';

jest.mock('../../src/modules/payments/razorpay.service', () => {
  const actual = jest.requireActual('../../src/modules/payments/razorpay.service');
  return {
    razorpayService: {
      ...actual.razorpayService,
      createOrder: jest.fn(),
      fetchOrder: jest.fn(),
      fetchPayment: jest.fn(),
      verifyCheckoutSignature: jest.fn(actual.razorpayService.verifyCheckoutSignature.bind(actual.razorpayService)),
      verifyWebhookSignature: jest.fn(actual.razorpayService.verifyWebhookSignature.bind(actual.razorpayService))
    }
  };
});

describe('POST /api/v1/donations/verify', () => {
  let donorId: bigint;
  let campaignId: bigint;

  beforeAll(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.paymentWebhookEvent.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.campaignCategory.deleteMany();

    const category = await prisma.campaignCategory.create({
      data: {
        name: 'Health Relief',
        slug: 'health-relief'
      }
    });

    const campaign = await prisma.campaign.create({
      data: {
        title: 'Medical Aid Campaign',
        slug: 'medical-aid-campaign',
        category_id: category.id,
        raised_amount: 0,
        status: 'ACTIVE',
        content: 'Help with medical supplies'
      }
    });
    campaignId = campaign.id;

    const donor = await prisma.donor.create({
      data: {
        donor_number: 'DNR-VERIFY-001',
        first_name: 'Rahul',
        last_name: 'Sharma',
        email: 'rahul.verify@example.com',
        phone: '9876543210'
      }
    });
    donorId = donor.id;
  });

  afterAll(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.paymentWebhookEvent.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.campaignCategory.deleteMany();
  });

  const createPendingDonation = async (amount = 1000, withCampaign = true, orderId = 'order_test_123') => {
    const donation = await prisma.donation.create({
      data: {
        donation_number: `DON-VERIFY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        donor_id: donorId,
        campaign_id: withCampaign ? campaignId : null,
        amount,
        payment_type: 'ONLINE',
        status: 'PENDING'
      }
    });

    const payment = await prisma.payment.create({
      data: {
        donation_id: donation.id,
        amount,
        provider: 'RAZORPAY',
        provider_order_id: orderId,
        status: 'CREATED'
      }
    });

    return { donation, payment };
  };

  const generateSignature = (orderId: string, paymentId: string) => {
    return crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
  };

  it('1. successful verification transitions Donation to SUCCESS and Payment to CAPTURED', async () => {
    const orderId = 'order_success_001';
    const paymentId = 'pay_success_001';
    const { donation } = await createPendingDonation(1000, true, orderId);

    const validSignature = generateSignature(orderId, paymentId);

    (razorpayService.fetchPayment as jest.Mock).mockResolvedValueOnce({
      id: paymentId,
      order_id: orderId,
      amount: 100000, // 1000 INR in paise
      currency: 'INR',
      status: 'captured',
      method: 'upi'
    });

    const res = await request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSignature
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.id).toBe(donation.id.toString());
    expect(res.body.data.status).toBe('SUCCESS');
    expect(res.body.data.payments[0].status).toBe('CAPTURED');
    expect(res.body.data.payments[0].provider_payment_id).toBe(paymentId);
    expect(res.body.data.payments[0].method).toBe('upi');

    // Verify DB state
    const updatedDonation = await prisma.donation.findUnique({
      where: { id: donation.id },
      include: { payments: true }
    });
    expect(updatedDonation?.status).toBe('SUCCESS');
    expect(updatedDonation?.payments[0].status).toBe('CAPTURED');
    expect(updatedDonation?.payments[0].provider_payment_id).toBe(paymentId);
    expect(updatedDonation?.payments[0].method).toBe('upi');

    // Campaign increment verified
    const updatedCampaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    expect(Number(updatedCampaign?.raised_amount)).toBe(1000);

    // Audit log verified
    const auditLogs = await prisma.auditLog.findMany({ where: { entity_id: donation.id } });
    const confirmLog = auditLogs.find(l => l.action === 'DONATION_CONFIRMED');
    expect(confirmLog).toBeTruthy();
  });

  it('2. successfully verifies donation without campaign (campaign_id: null)', async () => {
    const orderId = 'order_nocamp_002';
    const paymentId = 'pay_nocamp_002';
    await createPendingDonation(500, false, orderId);

    const validSignature = generateSignature(orderId, paymentId);

    (razorpayService.fetchPayment as jest.Mock).mockResolvedValueOnce({
      id: paymentId,
      order_id: orderId,
      amount: 50000,
      currency: 'INR',
      status: 'captured',
      method: 'card'
    });

    const res = await request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSignature
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('SUCCESS');
  });

  it('3. rejects invalid signature with 400 Bad Request', async () => {
    const orderId = 'order_bad_sig';
    const paymentId = 'pay_bad_sig';
    await createPendingDonation(500, false, orderId);

    const res = await request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: 'invalid_signature_hex'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid payment signature');
  });

  it('4. rejects unknown order ID with 404 Not Found', async () => {
    const res = await request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: 'order_non_existent',
        razorpay_payment_id: 'pay_123',
        razorpay_signature: 'any_signature'
      });

    expect(res.status).toBe(404);
  });

  it('5. rejects wrong payment ID mismatch with 400 Bad Request', async () => {
    const orderId = 'order_mismatch_005';
    const paymentId = 'pay_mismatch_005';
    await createPendingDonation(1000, true, orderId);

    const validSignature = generateSignature(orderId, paymentId);

    // Razorpay returns order_id of a DIFFERENT order
    (razorpayService.fetchPayment as jest.Mock).mockResolvedValueOnce({
      id: paymentId,
      order_id: 'order_different_999',
      amount: 100000,
      currency: 'INR',
      status: 'captured'
    });

    const res = await request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSignature
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('order ID mismatch');
  });

  it('6. rejects amount mismatch with 400 Bad Request', async () => {
    const orderId = 'order_amount_mismatch';
    const paymentId = 'pay_amount_mismatch';
    await createPendingDonation(1000, true, orderId);

    const validSignature = generateSignature(orderId, paymentId);

    (razorpayService.fetchPayment as jest.Mock).mockResolvedValueOnce({
      id: paymentId,
      order_id: orderId,
      amount: 50000, // only 500 INR instead of 1000 INR
      currency: 'INR',
      status: 'captured'
    });

    const res = await request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSignature
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('amount mismatch');
  });

  it('7. rejects currency mismatch with 400 Bad Request', async () => {
    const orderId = 'order_curr_mismatch';
    const paymentId = 'pay_curr_mismatch';
    await createPendingDonation(1000, true, orderId);

    const validSignature = generateSignature(orderId, paymentId);

    (razorpayService.fetchPayment as jest.Mock).mockResolvedValueOnce({
      id: paymentId,
      order_id: orderId,
      amount: 100000,
      currency: 'USD',
      status: 'captured'
    });

    const res = await request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSignature
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('currency must be INR');
  });

  it('8. rejects authorized (non-captured) payment with 400 Bad Request', async () => {
    const orderId = 'order_authorized_only';
    const paymentId = 'pay_authorized_only';
    const { donation } = await createPendingDonation(1000, true, orderId);

    const validSignature = generateSignature(orderId, paymentId);

    (razorpayService.fetchPayment as jest.Mock).mockResolvedValueOnce({
      id: paymentId,
      order_id: orderId,
      amount: 100000,
      currency: 'INR',
      status: 'authorized' // NOT captured!
    });

    const res = await request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSignature
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('not in captured state');

    // Verify donation remains PENDING
    const dbDonation = await prisma.donation.findUnique({ where: { id: donation.id } });
    expect(dbDonation?.status).toBe('PENDING');
  });

  it('9. rejects failed payment with 400 Bad Request', async () => {
    const orderId = 'order_failed_status';
    const paymentId = 'pay_failed_status';
    await createPendingDonation(1000, true, orderId);

    const validSignature = generateSignature(orderId, paymentId);

    (razorpayService.fetchPayment as jest.Mock).mockResolvedValueOnce({
      id: paymentId,
      order_id: orderId,
      amount: 100000,
      currency: 'INR',
      status: 'failed'
    });

    const res = await request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSignature
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('not in captured state');
  });

  it('10. already-successful donation returns 200 idempotently without re-incrementing campaign', async () => {
    const orderId = 'order_idempotent_010';
    const paymentId = 'pay_idempotent_010';
    const { donation } = await createPendingDonation(1000, true, orderId);

    const validSignature = generateSignature(orderId, paymentId);

    (razorpayService.fetchPayment as jest.Mock).mockResolvedValue({
      id: paymentId,
      order_id: orderId,
      amount: 100000,
      currency: 'INR',
      status: 'captured'
    });

    const campaignBefore = await prisma.campaign.findUnique({ where: { id: campaignId } });
    const raisedBefore = Number(campaignBefore?.raised_amount);

    // First call
    const res1 = await request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSignature
      });
    expect(res1.status).toBe(200);

    const campaignAfterFirst = await prisma.campaign.findUnique({ where: { id: campaignId } });
    expect(Number(campaignAfterFirst?.raised_amount)).toBe(raisedBefore + 1000);

    // Second call (idempotent replay)
    const res2 = await request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSignature
      });
    expect(res2.status).toBe(200);

    // Campaign amount must NOT increase again
    const campaignAfterSecond = await prisma.campaign.findUnique({ where: { id: campaignId } });
    expect(Number(campaignAfterSecond?.raised_amount)).toBe(raisedBefore + 1000);

    // Audit logs must have only 1 DONATION_CONFIRMED for this donation
    const auditLogs = await prisma.auditLog.findMany({ where: { entity_id: donation.id, action: 'DONATION_CONFIRMED' } });
    expect(auditLogs.length).toBe(1);
  });
});
