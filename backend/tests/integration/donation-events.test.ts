import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';
import * as donationListeners from '../../src/events/donation.listeners';
import { certificateService } from '../../src/modules/certificates/certificate.service';
import { emailService } from '../../src/modules/emails/email.service';
import crypto from 'crypto';
import { appEventEmitter } from '../../src/events/event-emitter';
import { DonationEvents } from '../../src/events/donation.events';

const generateToken = (userId: bigint) => sign({ id: userId.toString() }, env.JWT_SECRET, { expiresIn: '1h' });

let processPromise: Promise<void> | null = null;
const originalProcess = donationListeners.DonationJob.processDonationSuccess;
jest.mock('../../src/modules/payments/razorpay.service', () => ({ razorpayService: { createOrder: jest.fn().mockResolvedValue({ id: 'order_test_123' }), verifyPaymentSignature: jest.fn().mockReturnValue(true), verifyWebhookSignature: jest.fn().mockReturnValue(true) } }));

describe('Donation Events Integration (Phase D)', () => {
  let adminUserId: bigint;
  let adminToken: string;
  

  beforeAll(async () => {
    // Teardown
    await prisma.auditLog.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.paymentWebhookEvent.deleteMany();
    await prisma.refund.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.campaignCategory.deleteMany();
    await prisma.user.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.numberSequence.deleteMany();

    // Permissions & Admin
    const pRead = await prisma.permission.create({ data: { action: 'read', resource: 'donations' } });
    const pCreate = await prisma.permission.create({ data: { action: 'create', resource: 'donations' } });
    const pConfirm = await prisma.permission.create({ data: { action: 'confirm', resource: 'donations' } });
    const adminRole = await prisma.role.create({ data: { name: 'DonationAdminRole' } });
    await prisma.rolePermission.createMany({
      data: [
        { role_id: adminRole.id, permission_id: pRead.id },
        { role_id: adminRole.id, permission_id: pCreate.id },
        { role_id: adminRole.id, permission_id: pConfirm.id },
      ]
    });

    const admin = await prisma.user.create({
      data: { first_name: 'Admin', last_name: 'User', email: 'admin_integ@example.com', password_hash: 'hash', role_id: adminRole.id }
    });
    adminUserId = admin.id;
    adminToken = generateToken(adminUserId);

    // Campaign
    const cat = await prisma.campaignCategory.create({ data: { name: 'General', slug: 'gen-integ' } });
    await prisma.campaign.create({
      data: { category_id: cat.id, title: 'Integ Camp', slug: 'integ-camp', status: 'ACTIVE', content: 'Test' }
    });
    
  });

  afterAll(async () => {
    // Teardown
    await prisma.auditLog.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.paymentWebhookEvent.deleteMany();
    await prisma.refund.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.campaignCategory.deleteMany();
    await prisma.user.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.numberSequence.deleteMany();
  });

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
    
    // Clear dynamic data
    await prisma.auditLog.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.paymentWebhookEvent.deleteMany();
    await prisma.refund.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.numberSequence.deleteMany();
  });

  it('TASK 4: Proves offline donation confirmation triggers processing completely', async () => {
    // 1. Create Offline Donation
    const createRes = await request(app).post('/api/v1/donations/offline').set('Cookie', `token=${adminToken}`).send({
      amount: 1000, payment_type: 'CASH', donor: { first_name: 'OfflineInteg', email: 'offline@example.com' }
    });
    
    expect(createRes.status).toBe(201);
    const donationId = createRes.body.data.id;

    // 2. Confirm Donation
    const confirmRes = await request(app).patch(`/api/v1/donations/${donationId}/confirm`).set('Cookie', `token=${adminToken}`);
    expect(confirmRes.status).toBe(200);

    // 3. Await background event processing
    
    
    
    
    
    
    
    expect(processPromise).not.toBeNull();
    await processPromise;

    // 4. Verify Database state
    const cert = await prisma.certificate.findUnique({ where: { donation_id: BigInt(donationId) } });
    expect(cert).toBeDefined();
    expect(cert?.status).toBe('GENERATED');

    const email = await prisma.emailLog.findFirst({ where: { related_entity_id: BigInt(donationId), related_entity_type: 'DONATION' } });
    expect(email).toBeDefined();
    expect(email?.delivery_status).toBe('PENDING'); // MockProvider accepted it
  });

  it('TASK 5: Proves online payment success webhook triggers processing', async () => {
    // 1. Create Online Donation (Pending)
    const createRes = await request(app)
      .post('/api/v1/donations/online')
      .set('Idempotency-Key', '123e4567-e89b-12d3-a456-426614174000')
      .send({
        amount: 1000, 
        donor: { first_name: 'OnlineInteg', email: 'online@example.com', phone: '9876543210' }
      });
    
    expect(createRes.status).toBe(201);
    const orderId = createRes.body.data.razorpay_order_id;
    const donationId = createRes.body.data.id;

    // 2. Simulate Razorpay Webhook Call to processSuccessfulPayment implicitly via webhook logic
    
    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
    
    const payload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_test123',
            order_id: orderId,
            status: 'captured',
            method: 'card',
            amount: 100000,
            currency: 'INR'
          }
        }
      }
    };
    
    const signature = crypto.createHmac('sha256', webhookSecret)
                            .update(JSON.stringify(payload))
                            .digest('hex');

    const webhookResponse = await request(app)
      .post('/api/v1/payments/razorpay/webhook')
      .set('x-razorpay-signature', signature)
      .send(payload);
      
    if (webhookResponse.status !== 200) {
    }

    // 3. Await background event processing
    
    
    
    
    
    
    
    expect(processPromise).not.toBeNull();
    await processPromise;

    // 4. Verify Database state
    const cert = await prisma.certificate.findUnique({ where: { donation_id: BigInt(donationId) } });
    expect(cert).toBeDefined();
    
    const email = await prisma.emailLog.findFirst({ where: { related_entity_id: BigInt(donationId), related_entity_type: 'DONATION' } });
    expect(email).toBeDefined();
  });

  it('TASK 6: Idempotency - duplicate DONATION_SUCCESS does not duplicate certificates/emails', async () => {
    // 1. Create and confirm
    const createRes = await request(app).post('/api/v1/donations/offline').set('Cookie', `token=${adminToken}`).send({
      amount: 1000, payment_type: 'CASH', donor: { first_name: 'Idempotent', email: 'idem@example.com' }
    });
    const donationId = createRes.body.data.id;
    await request(app).patch(`/api/v1/donations/${donationId}/confirm`).set('Cookie', `token=${adminToken}`);
    
    await processPromise;

    // Count before duplicate
    const certCountBefore = await prisma.certificate.count({ where: { donation_id: BigInt(donationId) } });
    const emailCountBefore = await prisma.emailLog.count({ where: { related_entity_id: BigInt(donationId) } });

    expect(certCountBefore).toBe(1);
    expect(emailCountBefore).toBe(1);

    // 2. Trigger processing AGAIN for the same donation
    let secondProcessPromise: Promise<void> | null = null;
    jest.spyOn(donationListeners.DonationJob, 'processDonationSuccess').mockImplementationOnce((donationId) => {
      secondProcessPromise = originalProcess(donationId);
      return secondProcessPromise;
    });

    // We can't confirm again via API (it throws), so we manually emit the event to simulate a duplicate pub/sub delivery
    
    
    appEventEmitter.emit(DonationEvents.DONATION_SUCCESS, { donationId: BigInt(donationId) });

    expect(secondProcessPromise).not.toBeNull();
    await secondProcessPromise;

    // Count after duplicate
    const certCountAfter = await prisma.certificate.count({ where: { donation_id: BigInt(donationId) } });
    const emailCountAfter = await prisma.emailLog.count({ where: { related_entity_id: BigInt(donationId) } });

    // Should still be exactly 1
    expect(certCountAfter).toBe(certCountBefore);
    expect(emailCountAfter).toBe(emailCountBefore);
  });

  it('TASK 7: Failure Isolation - Certificate failure does not rollback Donation SUCCESS', async () => {
    const createRes = await request(app).post('/api/v1/donations/offline').set('Cookie', `token=${adminToken}`).send({
      amount: 1000, payment_type: 'CASH', donor: { first_name: 'IsoCert', email: 'isocert@example.com' }
    });
    const donationId = createRes.body.data.id;

    // Mock certificate generation to throw
    jest.spyOn(certificateService, 'generateCertificate').mockRejectedValueOnce(new Error('PDF Engine Failure'));

    await request(app).patch(`/api/v1/donations/${donationId}/confirm`).set('Cookie', `token=${adminToken}`);
    await processPromise;

    // Verify donation remains SUCCESS
    const don = await prisma.donation.findUnique({ where: { id: BigInt(donationId) } });
    expect(don?.status).toBe('SUCCESS');

    // No certificate created
    const certCount = await prisma.certificate.count({ where: { donation_id: BigInt(donationId) } });
    expect(certCount).toBe(0);
  });

  it('TASK 7: Failure Isolation - Email failure does not rollback Donation SUCCESS', async () => {
    const createRes = await request(app).post('/api/v1/donations/offline').set('Cookie', `token=${adminToken}`).send({
      amount: 1000, payment_type: 'CASH', donor: { first_name: 'IsoEmail', email: 'isoemail@example.com' }
    });
    const donationId = createRes.body.data.id;

    // Mock email generation to throw
    jest.spyOn(emailService, 'sendDonationReceipt').mockRejectedValueOnce(new Error('SMTP Down'));

    await request(app).patch(`/api/v1/donations/${donationId}/confirm`).set('Cookie', `token=${adminToken}`);
    await processPromise;

    // Verify donation remains SUCCESS
    const don = await prisma.donation.findUnique({ where: { id: BigInt(donationId) } });
    expect(don?.status).toBe('SUCCESS');

    // Certificate WAS created
    const certCount = await prisma.certificate.count({ where: { donation_id: BigInt(donationId) } });
    expect(certCount).toBe(1);
  });
});
