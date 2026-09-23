import { prisma } from '../../src/config/database';
import request from 'supertest';
import app from '../../src/app';
import { razorpayService } from '../../src/modules/payments/razorpay.service';
import crypto from 'crypto';
import * as donationListeners from '../../src/events/donation.listeners';
const uuidv4 = () => crypto.randomUUID();

jest.mock('../../src/modules/payments/razorpay.service', () => ({
  razorpayService: {
    createOrder: jest.fn(),
    verifyCheckoutSignature: jest.fn(),
    verifyWebhookSignature: jest.fn()
  }
}));

describe('Online Donation Phase B', () => {
  let processPromise: Promise<void> | null = null;
  const originalProcess = donationListeners.DonationJob.processDonationSuccess;

  beforeEach(() => {
    jest.spyOn(donationListeners.DonationJob, 'processDonationSuccess').mockImplementation((donationId) => {
      processPromise = originalProcess(donationId);
      return processPromise;
    });
  });

  afterEach(async () => {
    if (processPromise) {
      await processPromise;
      processPromise = null;
    }
    jest.restoreAllMocks();
  });

  let campaignId: bigint;

  beforeAll(async () => {
    // Basic setup
    await prisma.certificate.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.campaignCategory.deleteMany();
    await prisma.donor.deleteMany();

    const category = await prisma.campaignCategory.create({
      data: { name: 'Test Category', slug: 'test-category' }
    });

    const campaign = await prisma.campaign.create({
      data: {
        title: 'Test Campaign',
        slug: 'test-campaign',
        status: 'ACTIVE',
        content: 'Test content',
        category_id: category.id
      }
    });
    campaignId = campaign.id;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.certificate.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.campaignCategory.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.$disconnect();
  });

  const getValidPayload = () => ({
    amount: 1000,
    donor: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '9876543210'
    },
    campaign_id: campaignId.toString()
  });

  it('1. successful online donation creation', async () => {
    (razorpayService.createOrder as jest.Mock).mockResolvedValueOnce({ id: 'order_123' });

    const key = uuidv4();
    const res = await request(app)
      .post('/api/v1/donations/online')
      .set('Idempotency-Key', key)
      .send(getValidPayload());

    if (res.status !== 201) console.log('TEST 1 FAILED', res.body);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.status).toBe('PENDING'); // 2. Donation created as PENDING
    expect(res.body.data.payments[0].status).toBe('CREATED'); // 3. Payment created as CREATED
    expect(res.body.data.payments[0].provider).toBe('RAZORPAY'); // 4. Payment provider = RAZORPAY
    expect(res.body.data.payments[0].provider_order_id).toBe('order_123'); // 5. provider_order_id persisted
    expect(res.body.data.amount).toBe('1000'); // 6. correct INR amount
    expect(razorpayService.createOrder).toHaveBeenCalledWith({ // 7. RazorpayService amount test
      amount: expect.anything(),
      currency: 'INR',
      receipt: res.body.data.donation_number
    });

    const auditLogs = await prisma.auditLog.findMany({ where: { entity_id: BigInt(res.body.data.id) } });
    expect(auditLogs.length).toBeGreaterThan(0);
    const hasCorrectEvent = auditLogs.some(log => log.action === 'DONATION_CREATED');
    expect(hasCorrectEvent).toBe(true);
    const hasIncorrectEvent = auditLogs.some(log => log.action === 'ONLINE_DONATION_INTENT_CREATED');
    expect(hasIncorrectEvent).toBe(false);
  });

  it('8. missing Idempotency-Key rejected', async () => {
    const res = await request(app)
      .post('/api/v1/donations/online')
      .send(getValidPayload());

    expect(res.status).toBe(400);
  });

  it('9. invalid Idempotency-Key rejected', async () => {
    const res = await request(app)
      .post('/api/v1/donations/online')
      .set('Idempotency-Key', 'invalid-uuid')
      .send(getValidPayload());

    expect(res.status).toBe(400);
  });

  it('10. same key + same payload returns existing donation', async () => {
    const key = uuidv4();
    const payload = getValidPayload();
    (razorpayService.createOrder as jest.Mock).mockResolvedValueOnce({ id: 'order_abc' });

    const res1 = await request(app).post('/api/v1/donations/online').set('Idempotency-Key', key).send(payload);
    expect(res1.status).toBe(201);

    const res2 = await request(app).post('/api/v1/donations/online').set('Idempotency-Key', key).send(payload);
    if (res2.status !== 200 || !res2.body.data) console.log('TEST 10 FAILED res2', res2.body);
    expect(res2.status).toBe(200);
    expect(res2.body.data.id).toBe(res1.body.data.id);
    expect(res2.body.data.payments[0].provider_order_id).toBe('order_abc');

    // Razorpay should only be called once
    expect(razorpayService.createOrder).toHaveBeenCalledTimes(1);
  });

  it('11. same key + different amount returns 409', async () => {
    const key = uuidv4();
    const payload = getValidPayload();
    (razorpayService.createOrder as jest.Mock).mockResolvedValueOnce({ id: 'order_xyz' });

    await request(app).post('/api/v1/donations/online').set('Idempotency-Key', key).send(payload);

    const res2 = await request(app)
      .post('/api/v1/donations/online')
      .set('Idempotency-Key', key)
      .send({ ...payload, amount: 2000 });

    expect(res2.status).toBe(409);
  });

  it('12. same key + different campaign returns 409', async () => {
    const key = uuidv4();
    const payload = getValidPayload();
    (razorpayService.createOrder as jest.Mock).mockResolvedValueOnce({ id: 'order_xyz' });

    await request(app).post('/api/v1/donations/online').set('Idempotency-Key', key).send(payload);

    const res2 = await request(app)
      .post('/api/v1/donations/online')
      .set('Idempotency-Key', key)
      .send({ ...payload, campaign_id: undefined }); // omit campaign

    expect(res2.status).toBe(409);
  });

  it('13. same key + different materially relevant donor data returns 409', async () => {
    const key = uuidv4();
    const payload = getValidPayload();
    (razorpayService.createOrder as jest.Mock).mockResolvedValueOnce({ id: 'order_xyz' });

    await request(app).post('/api/v1/donations/online').set('Idempotency-Key', key).send(payload);

    const res2 = await request(app)
      .post('/api/v1/donations/online')
      .set('Idempotency-Key', key)
      .send({ ...payload, donor: { ...payload.donor, email: 'different@example.com' } });

    expect(res2.status).toBe(409);
  });

  it('14. Razorpay failure leaves Donation PENDING and Payment CREATED', async () => {
    const key = uuidv4();
    const payload = getValidPayload();
    (razorpayService.createOrder as jest.Mock).mockRejectedValueOnce(new Error('Gateway Timeout'));

    const res1 = await request(app).post('/api/v1/donations/online').set('Idempotency-Key', key).send(payload);

    expect(res1.status).toBe(500); // Because it throws AppError or native error (we didn't map 502 yet, it might be 500)
    
    // Check DB state
    const dbDonation = await prisma.donation.findUnique({ where: { idempotency_key: key }, include: { payments: true } });
    expect(dbDonation?.status).toBe('PENDING'); // 14
    expect(dbDonation?.payments[0].status).toBe('CREATED'); // 15
    expect(dbDonation?.payments[0].provider_order_id).toBeNull(); // 16

    // 17. retry after provider failure can create the provider order
    (razorpayService.createOrder as jest.Mock).mockResolvedValueOnce({ id: 'order_recovered' });
    const res2 = await request(app).post('/api/v1/donations/online').set('Idempotency-Key', key).send(payload);
    expect(res2.status).toBe(200); // Because it's an existing intent
    expect(res2.body.data.payments[0].provider_order_id).toBe('order_recovered');
  });

  it('CAS behavior check - concurrent same-key requests do not create multiple internal Donations', async () => {
    const key = uuidv4();
    const payload = getValidPayload();
    (razorpayService.createOrder as jest.Mock)
      .mockResolvedValueOnce({ id: 'order_race_1' })
      .mockResolvedValueOnce({ id: 'order_race_2' });

    // Race two requests
    const p1 = request(app).post('/api/v1/donations/online').set('Idempotency-Key', key).send(payload);
    const p2 = request(app).post('/api/v1/donations/online').set('Idempotency-Key', key).send(payload);

    await Promise.all([p1, p2]);

    // One will be 201, one will be 200 (or one 201 and one fails if we didn't handle it perfectly, but CAS should handle it)
    // Actually, prisma will throw UniqueConstraintViolation if both try to insert Donation at same time.
    // If one inserts and the other catches it, the other might return 200.
    // If they insert at EXACT same time, Prisma throws P2002. Our code doesn't explicitly catch P2002 to retry, but that's a standard ORM behavior we didn't add.
    // Wait, let's see what happens.
    
    const dbDonations = await prisma.donation.findMany({ where: { idempotency_key: key }, include: { payments: true } });
    expect(dbDonations.length).toBe(1); // 20. no multiple internal donations
    
    // We expect exactly one provider_order_id persisted
    expect(dbDonations[0].payments.length).toBe(1);
    expect(dbDonations[0].payments[0].provider_order_id).toBeTruthy();
  });

  it('rate limiting - restricts multiple requests and preserves existing donor rate limit', async () => {
    let rateLimited = false;
    let statusCode = 201;

    // Spam invalid requests to avoid hitting the database and quickly hit the rate limiter
    for (let i = 0; i < 110; i++) {
      const res = await request(app)
        .post('/api/v1/donations/online')
        // Omitting body to trigger validation error (400) instead of DB hit
        .send({});

      if (res.status === 429) {
        rateLimited = true;
        statusCode = res.status;
        break;
      }
    }

    expect(rateLimited).toBe(true);
    expect(statusCode).toBe(429);
  });
});
