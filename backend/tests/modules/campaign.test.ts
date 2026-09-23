import request from 'supertest';

jest.mock('sanitize-html', () => ({
  __esModule: true,
  default: Object.assign((html: string) => html.replace(/<script.*?>.*?<\/script>/gi, ''), { defaults: { allowedTags: [], allowedAttributes: {} } })
}));
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';
const generateToken = (userId: string, _status?: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });
import { donationService } from '../../src/modules/donations/donation.service';
import { DonationJob } from '../../src/events/donation.listeners';

import { Prisma } from '@prisma/client';



describe('Campaigns Module (Phase E)', () => {
  let adminToken: string;
  let regularToken: string;
  let testAdminId: bigint;
  
  let testCategoryId: bigint;
  let pCreate: any;
  let pRead: any;
  let pUpdate: any;
  let pDelete: any;

  beforeAll(async () => {
    await prisma.certificate.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.paymentWebhookEvent.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.campaignCategory.deleteMany();
    await prisma.user.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();

    // Permissions
    pCreate = await prisma.permission.create({ data: { action: 'create', resource: 'campaigns' } });
    pRead = await prisma.permission.create({ data: { action: 'read', resource: 'campaigns' } });
    pUpdate = await prisma.permission.create({ data: { action: 'update', resource: 'campaigns' } });
    pDelete = await prisma.permission.create({ data: { action: 'delete', resource: 'campaigns' } });

    const adminRole = await prisma.role.create({ data: { name: 'CampaignAdmin' } });
    const userRole = await prisma.role.create({ data: { name: 'CampaignUser' } });

    await prisma.rolePermission.createMany({
      data: [
        { role_id: adminRole.id, permission_id: pCreate.id },
        { role_id: adminRole.id, permission_id: pRead.id },
        { role_id: adminRole.id, permission_id: pUpdate.id },
        { role_id: adminRole.id, permission_id: pDelete.id },
      ]
    });

    const admin = await prisma.user.create({
      data: {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin.campaign@chah.test',
        password_hash: 'hashed',
        role_id: adminRole.id
      }
    });
    testAdminId = admin.id;

    const user = await prisma.user.create({
      data: {
        first_name: 'Reg',
        last_name: 'User',
        email: 'user.campaign@chah.test',
        password_hash: 'hashed',
        role_id: userRole.id
      }
    });
    

    adminToken = generateToken(admin.id.toString(), 'ACTIVE');
    regularToken = generateToken(user.id.toString(), 'ACTIVE');

    const cat = await prisma.campaignCategory.create({
      data: { name: 'Test Category', slug: 'test-category' }
    });
    testCategoryId = cat.id;
  });

  afterAll(async () => {
    await prisma.certificate.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.paymentWebhookEvent.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.campaignCategory.deleteMany();
    await prisma.user.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await prisma.certificate.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.paymentWebhookEvent.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.campaign.deleteMany();
  });

  describe('RBAC & Validation', () => {
    it('should deny create if unauthenticated', async () => {
      const res = await request(app).post('/api/v1/campaigns').send({});
      expect(res.status).toBe(401);
    });

    it('should deny create if missing permission', async () => {
      const res = await request(app)
        .post('/api/v1/campaigns')
        .set('Cookie', `token=${regularToken}`)
        .send({});
      expect(res.status).toBe(403);
    });

    it('should require title, category_id, content', async () => {
      const res = await request(app)
        .post('/api/v1/campaigns')
        .set('Cookie', `token=${adminToken}`)
        .send({
          title: 'A'
        });
      expect(res.status).toBe(400); // Zod validation
    });

    it('should reject end_date <= start_date', async () => {
      const res = await request(app)
        .post('/api/v1/campaigns')
        .set('Cookie', `token=${adminToken}`)
        .send({
          title: 'Valid Title',
          category_id: testCategoryId.toString(),
          content: 'Some content',
          start_date: new Date('2030-01-02').toISOString(),
          end_date: new Date('2030-01-01').toISOString()
        });
      expect(res.status).toBe(400);
      expect(JSON.stringify(res.body)).toContain('end_date');
    });
  });

  describe('Creation and Slug Concurrency', () => {
    it('should create campaign successfully with valid payload', async () => {
      const res = await request(app)
        .post('/api/v1/campaigns')
        .set('Cookie', `token=${adminToken}`)
        .send({
          title: 'Help Education',
          category_id: testCategoryId.toString(),
          content: '<p>Content</p><script>alert(1)</script>'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe('help-education');
      expect(res.body.data.content).toBe('<p>Content</p>'); // sanitized
      expect(res.body.data.raised_amount).toBe('0');
      expect(res.body.data.status).toBe('ACTIVE');
    });

    it('should handle slug concurrency and generate unique slugs', async () => {
      const promises = Array.from({ length: 5 }).map(() =>
        request(app)
          .post('/api/v1/campaigns')
          .set('Cookie', `token=${adminToken}`)
          .send({
            title: 'Concurrent Campaign',
            category_id: testCategoryId.toString(),
            content: 'Concurrent'
          })
      );

      const results = await Promise.all(promises);
      results.forEach(res => expect(res.status).toBe(201));

      const slugs = results.map(res => res.body.data.slug).sort();
      expect(slugs.length).toBe(5);
      expect(new Set(slugs).size).toBe(5);
      expect(slugs).toContain('concurrent-campaign');
      expect(slugs).toContain('concurrent-campaign-1');
    });

    it('should ignore raised_amount in create payload', async () => {
      const res = await request(app)
        .post('/api/v1/campaigns')
        .set('Cookie', `token=${adminToken}`)
        .send({
          title: 'Fake Money',
          category_id: testCategoryId.toString(),
          content: 'Test',
          raised_amount: 1000000 // Should be ignored
        });
      
      expect(res.status).toBe(201);
      expect(res.body.data.raised_amount).toBe('0');
    });
  });

  describe('Update and Cancellation', () => {
    let campaignId: string;
    let initialSlug: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/campaigns')
        .set('Cookie', `token=${adminToken}`)
        .send({
          title: 'Update Test',
          category_id: testCategoryId.toString(),
          content: 'Test'
        });
      campaignId = res.body.data.id;
      initialSlug = res.body.data.slug;
    });

    it('should not change slug when title is updated', async () => {
      const res = await request(app)
        .patch(`/api/v1/campaigns/${campaignId}`)
        .set('Cookie', `token=${adminToken}`)
        .send({
          title: 'Updated Title'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.slug).toBe(initialSlug); // slug is immutable
    });

    it('should cancel campaign but not physically delete it', async () => {
      const res = await request(app)
        .patch(`/api/v1/campaigns/${campaignId}/status`)
        .set('Cookie', `token=${adminToken}`)
        .send();
      
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('CANCELLED');

      // Verify it's still in the DB
      const dbCheck = await prisma.campaign.findUnique({ where: { id: BigInt(campaignId) } });
      expect(dbCheck?.status).toBe('CANCELLED');

      // Verify public access returns 200
      const publicRes = await request(app).get(`/api/v1/campaigns/slug/${initialSlug}`);
      expect(publicRes.status).toBe(200);
      expect(publicRes.body.data.status).toBe('CANCELLED');
    });

    it('should ignore raised_amount in update payload', async () => {
      const res = await request(app)
        .patch(`/api/v1/campaigns/${campaignId}`)
        .set('Cookie', `token=${adminToken}`)
        .send({
          raised_amount: 99999
        });
      
      expect(res.status).toBe(200);
      expect(res.body.data.raised_amount).toBe('0');
    });
  });

  describe('Financial Concurrency and Auto-completion', () => {
    let campaignId: bigint;
    let donorId: bigint;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/campaigns')
        .set('Cookie', `token=${adminToken}`)
        .send({
          title: 'Fundraiser',
          category_id: testCategoryId.toString(),
          content: 'Fundraiser content',
          target_amount: 1000 // 1000 INR
        });
      if (res.status !== 201) console.error('CAMPAIGN CREATE FAILED:', res.body, JSON.stringify(res.body.errors), res.status); campaignId = BigInt(res.body.data?.id || 0);

      await prisma.donor.deleteMany({ where: { donor_number: 'DON-1' } });
      const donor = await prisma.donor.create({
        data: { donor_number: 'DON-1', first_name: 'Test' }
      });
      donorId = donor.id;
    });

    it('should correctly aggregate concurrent successful donations and autocomplete', async () => {
      // Simulate multiple concurrent SUCCESS webhooks that invoke the donation success flow
      
      const createDonation = async (idx: number, amount: number) => {
        const donation = await prisma.donation.create({
          data: {
            donation_number: `DN-${idx}`,
            donor_id: donorId,
            campaign_id: campaignId,
            amount: new Prisma.Decimal(amount),
            payment_type: 'ONLINE',
            status: 'PENDING'
          }
        });
        
        const payment = await prisma.payment.create({
          data: {
            donation_id: donation.id,
            amount: new Prisma.Decimal(amount),
            provider: 'RAZORPAY',
            provider_payment_id: `PAY_${idx}`,
            status: 'CREATED'
          }
        });

        return payment.id;
      };

      const d1 = await createDonation(1, 400);
      const d2 = await createDonation(2, 400);
      const d3 = await createDonation(3, 400);

      // Now process all three concurrently by importing the service
      

      const audit = { actorUserId: testAdminId, ipAddress: '127.0.0.1' };

      const originalProcessDonationSuccess = DonationJob.processDonationSuccess;
      const promises: Promise<void>[] = [];
      jest.spyOn(DonationJob, 'processDonationSuccess').mockImplementation((id: bigint) => {
        const p = originalProcessDonationSuccess(id);
        promises.push(p);
        return p;
      });
      await Promise.all([
        donationService.processSuccessfulPayment({ paymentId: d1, providerPaymentId: 'PAY_1', auditContext: audit }),
        donationService.processSuccessfulPayment({ paymentId: d2, providerPaymentId: 'PAY_2', auditContext: audit }),
        donationService.processSuccessfulPayment({ paymentId: d3, providerPaymentId: 'PAY_3', auditContext: audit })
      ]);

      await Promise.all(promises);
      const updatedCampaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
      expect(updatedCampaign?.raised_amount.toString()).toBe('1200'); // 400 * 3
      expect(updatedCampaign?.status).toBe('COMPLETED');
    });

    it('should remain ACTIVE if target_amount is NULL', async () => {
      const res = await request(app)
        .post('/api/v1/campaigns')
        .set('Cookie', `token=${adminToken}`)
        .send({
          title: 'No Target Fundraiser',
          category_id: testCategoryId.toString(),
          content: 'Content'
        });
      const noTargetId = BigInt(res.body.data?.id); if (res.status !== 201) console.error('CAMPAIGN CREATE FAILED:', res.body);

      const d1 = await prisma.donation.create({
        data: {
          donation_number: 'DN-99',
          donor_id: donorId,
          campaign_id: noTargetId,
          amount: new Prisma.Decimal(10000),
          payment_type: 'ONLINE',
          status: 'PENDING'
        }
      });
      const payment = await prisma.payment.create({
        data: {
          donation_id: d1.id,
          amount: new Prisma.Decimal(10000),
          provider: 'RAZORPAY',
          provider_payment_id: 'PAY_99',
          status: 'CREATED'
        }
      });

      
      const originalProcessDonationSuccess = DonationJob.processDonationSuccess;
      const promises: Promise<void>[] = [];
      jest.spyOn(DonationJob, 'processDonationSuccess').mockImplementation((id: bigint) => {
        const p = originalProcessDonationSuccess(id);
        promises.push(p);
        return p;
      });
      await donationService.processSuccessfulPayment({ paymentId: payment.id, providerPaymentId: 'PAY_99', auditContext: { actorUserId: testAdminId } });
      await Promise.all(promises);

      const updatedCampaign = await prisma.campaign.findUnique({ where: { id: noTargetId } });
      expect(updatedCampaign?.raised_amount.toString()).toBe('10000');
      expect(updatedCampaign?.status).toBe('ACTIVE');
    });
  });
});
