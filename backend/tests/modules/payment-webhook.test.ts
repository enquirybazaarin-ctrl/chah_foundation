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

describe('POST /api/v1/payments/razorpay/webhook', () => {
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
        name: 'Education Fund',
        slug: 'education-fund'
      }
    });

    const campaign = await prisma.campaign.create({
      data: {
        title: 'Child Education Campaign',
        slug: 'child-education-campaign',
        category_id: category.id,
        raised_amount: 0,
        status: 'ACTIVE',
        content: 'Help educate underprivileged children'
      }
    });
    campaignId = campaign.id;

    const donor = await prisma.donor.create({
      data: {
        donor_number: 'DNR-WEBHOOK-001',
        first_name: 'Amit',
        last_name: 'Verma',
        email: 'amit.webhook@example.com',
        phone: '9123456780'
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

  const createPendingDonation = async (amount = 1000, orderId = 'order_webhook_123') => {
    const donation = await prisma.donation.create({
      data: {
        donation_number: `DON-WH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        donor_id: donorId,
        campaign_id: campaignId,
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

  const generateWebhookSignature = (rawBody: string | Buffer) => {
    return crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');
  };

  it('1. rejects invalid webhook signature with 400 Bad Request', async () => {
    const payload = JSON.stringify({ event: 'payment.captured' });

    const res = await request(app)
      .post('/api/v1/payments/razorpay/webhook')
      .set('Content-Type', 'application/json')
      .set('x-razorpay-signature', 'invalid_signature_hex')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid webhook signature');
  });

  it('2. payment.captured successfully transitions Donation to SUCCESS, Payment to CAPTURED, increments campaign and marks event PROCESSED', async () => {
    const orderId = 'order_captured_002';
    const paymentId = 'pay_captured_002';
    const eventId = 'evt_captured_002';
    const { donation } = await createPendingDonation(1000, orderId);

    const webhookPayload = {
      id: eventId,
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: orderId,
            amount: 100000,
            currency: 'INR',
            status: 'captured',
            method: 'netbanking'
          }
        }
      }
    };

    const rawBody = JSON.stringify(webhookPayload);
    const signature = generateWebhookSignature(rawBody);

    const res = await request(app)
      .post('/api/v1/payments/razorpay/webhook')
      .set('Content-Type', 'application/json')
      .set('x-razorpay-signature', signature)
      .set('x-razorpay-event-id', eventId)
      .send(rawBody);

    expect(res.status).toBe(200);

    // Verify DB states
    const updatedDonation = await prisma.donation.findUnique({
      where: { id: donation.id },
      include: { payments: true }
    });
    expect(updatedDonation?.status).toBe('SUCCESS');
    expect(updatedDonation?.payments[0].status).toBe('CAPTURED');
    expect(updatedDonation?.payments[0].provider_payment_id).toBe(paymentId);
    expect(updatedDonation?.payments[0].method).toBe('netbanking');

    // Verify campaign increment
    const updatedCampaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    expect(Number(updatedCampaign?.raised_amount)).toBe(1000);

    // Verify webhook event state
    const dbEvent = await prisma.paymentWebhookEvent.findUnique({ where: { provider_event_id: eventId } });
    expect(dbEvent?.processing_state).toBe('PROCESSED');
    expect(dbEvent?.processed_at).toBeTruthy();
  });

  it('3. payment.failed updates Payment to FAILED and marks event PROCESSED while Donation remains PENDING', async () => {
    const orderId = 'order_failed_003';
    const paymentId = 'pay_failed_003';
    const eventId = 'evt_failed_003';
    const { donation, payment } = await createPendingDonation(1000, orderId);

    const webhookPayload = {
      id: eventId,
      event: 'payment.failed',
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: orderId,
            amount: 100000,
            currency: 'INR',
            status: 'failed',
            error_code: 'BAD_REQUEST_ERROR',
            error_description: 'Payment was declined by issuing bank'
          }
        }
      }
    };

    const rawBody = JSON.stringify(webhookPayload);
    const signature = generateWebhookSignature(rawBody);

    const res = await request(app)
      .post('/api/v1/payments/razorpay/webhook')
      .set('Content-Type', 'application/json')
      .set('x-razorpay-signature', signature)
      .set('x-razorpay-event-id', eventId)
      .send(rawBody);

    expect(res.status).toBe(200);

    // Verify DB states
    const dbDonation = await prisma.donation.findUnique({ where: { id: donation.id } });
    expect(dbDonation?.status).toBe('PENDING'); // Donation remains PENDING for retry!

    const dbPayment = await prisma.payment.findUnique({ where: { id: payment.id } });
    expect(dbPayment?.status).toBe('FAILED');
    expect(dbPayment?.error_message).toBe('Payment was declined by issuing bank');

    const dbEvent = await prisma.paymentWebhookEvent.findUnique({ where: { provider_event_id: eventId } });
    expect(dbEvent?.processing_state).toBe('PROCESSED');
  });

  it('4. duplicate PROCESSED event returns 200 without reprocessing', async () => {
    const eventId = 'evt_dup_004';
    await prisma.paymentWebhookEvent.create({
      data: {
        provider: 'RAZORPAY',
        provider_event_id: eventId,
        event_type: 'payment.captured',
        payload: { test: true },
        signature_valid: true,
        processing_state: 'PROCESSED',
        received_at: new Date(),
        processed_at: new Date()
      }
    });

    const rawBody = JSON.stringify({ id: eventId, event: 'payment.captured' });
    const signature = generateWebhookSignature(rawBody);

    const res = await request(app)
      .post('/api/v1/payments/razorpay/webhook')
      .set('Content-Type', 'application/json')
      .set('x-razorpay-signature', signature)
      .set('x-razorpay-event-id', eventId)
      .send(rawBody);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('already processed');
  });

  it('5. PENDING event recovery on retry re-enters and completes financial processing', async () => {
    const orderId = 'order_pending_recovery_005';
    const paymentId = 'pay_pending_recovery_005';
    const eventId = 'evt_pending_recovery_005';
    const { donation } = await createPendingDonation(1000, orderId);

    const webhookPayload = {
      id: eventId,
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: orderId,
            amount: 100000,
            currency: 'INR',
            status: 'captured',
            method: 'upi'
          }
        }
      }
    };

    // Simulate crash after event creation: event stuck in PENDING
    await prisma.paymentWebhookEvent.create({
      data: {
        provider: 'RAZORPAY',
        provider_event_id: eventId,
        event_type: 'payment.captured',
        payload: webhookPayload,
        signature_valid: true,
        processing_state: 'PENDING',
        received_at: new Date()
      }
    });

    const rawBody = JSON.stringify(webhookPayload);
    const signature = generateWebhookSignature(rawBody);

    // Razorpay retries the webhook delivery
    const res = await request(app)
      .post('/api/v1/payments/razorpay/webhook')
      .set('Content-Type', 'application/json')
      .set('x-razorpay-signature', signature)
      .set('x-razorpay-event-id', eventId)
      .send(rawBody);

    expect(res.status).toBe(200);

    // Verify recovery succeeded
    const updatedDonation = await prisma.donation.findUnique({ where: { id: donation.id } });
    expect(updatedDonation?.status).toBe('SUCCESS');

    const dbEvent = await prisma.paymentWebhookEvent.findUnique({ where: { provider_event_id: eventId } });
    expect(dbEvent?.processing_state).toBe('PROCESSED');
  });

  it('6. FAILED event recovery on retry re-enters and completes financial processing', async () => {
    const orderId = 'order_failed_recovery_006';
    const paymentId = 'pay_failed_recovery_006';
    const eventId = 'evt_failed_recovery_006';
    const { donation } = await createPendingDonation(1000, orderId);

    const webhookPayload = {
      id: eventId,
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: orderId,
            amount: 100000,
            currency: 'INR',
            status: 'captured',
            method: 'card'
          }
        }
      }
    };

    // Simulate event stuck in FAILED due to earlier transient issue
    await prisma.paymentWebhookEvent.create({
      data: {
        provider: 'RAZORPAY',
        provider_event_id: eventId,
        event_type: 'payment.captured',
        payload: webhookPayload,
        signature_valid: true,
        processing_state: 'FAILED',
        error_message: 'Transient network error',
        received_at: new Date()
      }
    });

    const rawBody = JSON.stringify(webhookPayload);
    const signature = generateWebhookSignature(rawBody);

    const res = await request(app)
      .post('/api/v1/payments/razorpay/webhook')
      .set('Content-Type', 'application/json')
      .set('x-razorpay-signature', signature)
      .set('x-razorpay-event-id', eventId)
      .send(rawBody);

    expect(res.status).toBe(200);

    const updatedDonation = await prisma.donation.findUnique({ where: { id: donation.id } });
    expect(updatedDonation?.status).toBe('SUCCESS');

    const dbEvent = await prisma.paymentWebhookEvent.findUnique({ where: { provider_event_id: eventId } });
    expect(dbEvent?.processing_state).toBe('PROCESSED');
  });

  it('7. concurrent duplicate webhooks execute safely without double-incrementing campaign', async () => {
    const orderId = 'order_concurrent_wh_007';
    const paymentId = 'pay_concurrent_wh_007';
    const eventId = 'evt_concurrent_wh_007';
    const { donation } = await createPendingDonation(1000, orderId);

    const webhookPayload = {
      id: eventId,
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: orderId,
            amount: 100000,
            currency: 'INR',
            status: 'captured',
            method: 'upi'
          }
        }
      }
    };

    const rawBody = JSON.stringify(webhookPayload);
    const signature = generateWebhookSignature(rawBody);

    const campaignBefore = await prisma.campaign.findUnique({ where: { id: campaignId } });
    const raisedBefore = Number(campaignBefore?.raised_amount);

    const sendWebhook = () =>
      request(app)
        .post('/api/v1/payments/razorpay/webhook')
        .set('Content-Type', 'application/json')
        .set('x-razorpay-signature', signature)
        .set('x-razorpay-event-id', eventId)
        .send(rawBody);

    // Race two duplicate webhook deliveries
    await Promise.all([sendWebhook(), sendWebhook()]);

    const updatedDonation = await prisma.donation.findUnique({ where: { id: donation.id } });
    expect(updatedDonation?.status).toBe('SUCCESS');

    const campaignAfter = await prisma.campaign.findUnique({ where: { id: campaignId } });
    // Must be incremented by EXACTLY 1000
    expect(Number(campaignAfter?.raised_amount)).toBe(raisedBefore + 1000);
  });

  it('8. concurrent checkout verification and webhook race increments campaign exactly once', async () => {
    const orderId = 'order_race_verify_wh_008';
    const paymentId = 'pay_race_verify_wh_008';
    const eventId = 'evt_race_verify_wh_008';
    const { donation } = await createPendingDonation(1000, orderId);

    // Setup checkout verification data
    const verifySignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    (razorpayService.fetchPayment as jest.Mock).mockResolvedValue({
      id: paymentId,
      order_id: orderId,
      amount: 100000,
      currency: 'INR',
      status: 'captured',
      method: 'card'
    });

    // Setup webhook data
    const webhookPayload = {
      id: eventId,
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: orderId,
            amount: 100000,
            currency: 'INR',
            status: 'captured',
            method: 'card'
          }
        }
      }
    };
    const rawBody = JSON.stringify(webhookPayload);
    const webhookSignature = generateWebhookSignature(rawBody);

    const campaignBefore = await prisma.campaign.findUnique({ where: { id: campaignId } });
    const raisedBefore = Number(campaignBefore?.raised_amount);

    const reqVerify = request(app)
      .post('/api/v1/donations/verify')
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: verifySignature
      });

    const reqWebhook = request(app)
      .post('/api/v1/payments/razorpay/webhook')
      .set('Content-Type', 'application/json')
      .set('x-razorpay-signature', webhookSignature)
      .set('x-razorpay-event-id', eventId)
      .send(rawBody);

    // Race verify and webhook concurrently
    await Promise.all([reqVerify, reqWebhook]);

    const updatedDonation = await prisma.donation.findUnique({ where: { id: donation.id } });
    expect(updatedDonation?.status).toBe('SUCCESS');

    const campaignAfter = await prisma.campaign.findUnique({ where: { id: campaignId } });
    // Must be incremented by EXACTLY 1000
    expect(Number(campaignAfter?.raised_amount)).toBe(raisedBefore + 1000);

    // Audit logs must have only 1 DONATION_CONFIRMED
    const auditLogs = await prisma.auditLog.findMany({ where: { entity_id: donation.id, action: 'DONATION_CONFIRMED' } });
    expect(auditLogs.length).toBe(1);
  });

  it('9. order.paid event is safely acknowledged with 200 OK', async () => {
    const eventId = 'evt_order_paid_009';
    const webhookPayload = {
      id: eventId,
      event: 'order.paid',
      payload: {
        order: {
          entity: {
            id: 'order_test_paid'
          }
        }
      }
    };

    const rawBody = JSON.stringify(webhookPayload);
    const signature = generateWebhookSignature(rawBody);

    const res = await request(app)
      .post('/api/v1/payments/razorpay/webhook')
      .set('Content-Type', 'application/json')
      .set('x-razorpay-signature', signature)
      .set('x-razorpay-event-id', eventId)
      .send(rawBody);

    expect(res.status).toBe(200);
  });
});
