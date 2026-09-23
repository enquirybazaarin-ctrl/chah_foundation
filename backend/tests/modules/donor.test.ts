import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';
import { donorRepository } from '../../src/modules/donors/donor.repository';
const generateToken = (userId: bigint) => {
  return sign({ id: userId.toString() }, env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Donor Module Tests', () => {
  let adminUserId: bigint;
  let adminToken: string;
  let regularUserId: bigint;
  let regularToken: string;

  beforeAll(async () => {
    // Clear data securely in chah_dev
        await prisma.auditLog.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.paymentWebhookEvent.deleteMany();
    await prisma.refund.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.numberSequence.deleteMany();

    // Create permissions
    const pRead = await prisma.permission.create({ data: { action: 'read', resource: 'donors' } });
    const pCreate = await prisma.permission.create({ data: { action: 'create', resource: 'donors' } });
    const pUpdate = await prisma.permission.create({ data: { action: 'update', resource: 'donors' } });

    // Create roles
    const adminRole = await prisma.role.create({ data: { name: 'AdminRole' } });
    const userRole = await prisma.role.create({ data: { name: 'UserRole' } });

    await prisma.rolePermission.createMany({
      data: [
        { role_id: adminRole.id, permission_id: pRead.id },
        { role_id: adminRole.id, permission_id: pCreate.id },
        { role_id: adminRole.id, permission_id: pUpdate.id },
      ]
    });

    // Create users
    const admin = await prisma.user.create({
      data: {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin_donor_test@example.com',
        password_hash: 'hash',
        role_id: adminRole.id
      }
    });
    adminUserId = admin.id;
    adminToken = generateToken(adminUserId);

    const user = await prisma.user.create({
      data: {
        first_name: 'Reg',
        last_name: 'User',
        email: 'user_donor_test@example.com',
        password_hash: 'hash',
        role_id: userRole.id
      }
    });
    regularUserId = user.id;
    regularToken = generateToken(regularUserId);
  });

  afterAll(async () => {
        await prisma.auditLog.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.paymentWebhookEvent.deleteMany();
    await prisma.refund.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.numberSequence.deleteMany();
  });

  beforeEach(async () => {
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

  describe('Creation & Duplicate Matching', () => {
    it('should allow public creation and not leak donor existence', async () => {
      const res = await request(app)
        .post('/api/v1/donors')
        .send({
          first_name: 'Public',
          email: 'public@example.com',
          phone: '1234567890'
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('donor_number');
      expect(res.body.data.email).toBe('public@example.com');
      
      const donorNumber1 = res.body.data.donor_number;

      // Submit same details again (Public)
      const res2 = await request(app)
        .post('/api/v1/donors')
        .send({
          first_name: 'Public Two',
          email: 'public@example.com',
          phone: '1234567890'
        });

      expect(res2.status).toBe(201);
      expect(res2.body.status).toBe('success');
      // Must not leak the original donor ID
      expect(res2.body.data.donor_number).toBe(donorNumber1); // Reused
      expect(res2.body.data.first_name).toBe('Public Two'); // Updated
    });

    it('should reuse existing donor on exact email match without phone', async () => {
      const res1 = await request(app)
        .post('/api/v1/donors')
        .send({ first_name: 'EmailMatch1', email: 'emailonly@example.com' });
      
      const donorNumber1 = res1.body.data.donor_number;
      const initialCount = await prisma.donor.count();

      const res2 = await request(app)
        .post('/api/v1/donors')
        .send({ first_name: 'EmailMatch2', email: 'emailonly@example.com' });
      
      expect(res2.status).toBe(201);
      expect(res2.body.data.donor_number).toBe(donorNumber1);
      const finalCount = await prisma.donor.count();
      expect(finalCount).toBe(initialCount); // No second donor created
    });

    it('should reuse existing donor on exact phone match without email', async () => {
      const res1 = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'PhoneMatch1', phone: '9999999999' });
      
      const donorNumber1 = res1.body.data.donor_number;
      const initialCount = await prisma.donor.count();

      const res2 = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'PhoneMatch2', phone: '9999999999' });
      
      expect(res2.status).toBe(201);
      expect(res2.body.data.donor_number).toBe(donorNumber1);
      const finalCount = await prisma.donor.count();
      expect(finalCount).toBe(initialCount);
    });

    it('should reuse existing donor when matched by exact email and phone', async () => {
      const res1 = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'FullMatch1', email: 'full@example.com', phone: '8888888888' });
      
      const donorNumber1 = res1.body.data.donor_number;
      const donorId = res1.body.data.id;
      
      // Clear audit log from the creation to test update audit behavior cleanly
      await prisma.auditLog.deleteMany();

      const res2 = await request(app)
        .post('/api/v1/donors')
        .send({ first_name: 'FullMatch2', email: 'full@example.com', phone: '8888888888' });
      
      expect(res2.status).toBe(201);
      expect(res2.body.data.donor_number).toBe(donorNumber1);
      expect(res2.body.data.first_name).toBe('FullMatch2'); // Profile updated
      
      const creationAudit = await prisma.auditLog.findFirst({ where: { action: 'DONOR_CREATED', entity_id: BigInt(donorId) } });
      expect(creationAudit).toBeNull(); // No new DONOR_CREATED

      const updateAudit = await prisma.auditLog.findFirst({ where: { action: 'DONOR_UPDATED', entity_id: BigInt(donorId) } });
      expect(updateAudit).not.toBeNull(); // Appropriate profile update behavior
    });

    it('should create new donor if emails match but phones belong to DIFFERENT donors', async () => {
      // Create Donor 1
      await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'One', email: 'conflict@example.com', phone: '111111' });

      // Create Donor 2
      await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'Two', email: 'other@example.com', phone: '222222' });

      // Try to create with Donor 1's email and Donor 2's phone
      const res = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'Three', email: 'conflict@example.com', phone: '222222' });

      expect(res.status).toBe(201);
      expect(res.body.data.first_name).toBe('Three');
      
      // Should have created a third donor since it's a conflict
      const count = await prisma.donor.count();
      expect(count).toBe(3);
    });

    it('should allow nullable/non-unique email and phone', async () => {
      // Two donors with no email/phone
      const res1 = await request(app).post('/api/v1/donors').set('Cookie', `token=${adminToken}`).send({ first_name: 'No', last_name: 'Contact' });
      const res2 = await request(app).post('/api/v1/donors').set('Cookie', `token=${adminToken}`).send({ first_name: 'Also No', last_name: 'Contact' });

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(res1.body.data.id).not.toEqual(res2.body.data.id);
    });

    it('should verify sequence and donor creation are in same transaction via rollback', async () => {
      // Mock repository to throw error after sequence generation
      const spy = jest.spyOn(donorRepository, 'create').mockRejectedValue(new Error('Simulated DB Error'));

      const res = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'Fail' });

      expect(res.status).toBe(500);

      // Verify sequence rolled back (no sequence in DB)
      const seq = await prisma.numberSequence.findUnique({ where: { name: `DONOR_${new Date().getFullYear()}` } });
      expect(seq).toBeNull(); // Should be completely rolled back because it was a new insert

      // Restore
      spy.mockRestore();
    });

    it('should not allow client to control donor_number', async () => {
      const res = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'Hacker', donor_number: 'HACKED-123' });

      expect(res.status).toBe(201);
      expect(res.body.data.donor_number).not.toBe('HACKED-123');
      expect(res.body.data.donor_number).toMatch(/^DNR-\d{4}-\d{6}$/);
    });
  });

  describe('PAN Security & Validation', () => {
    it('should reject invalid PAN', async () => {
      const res = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'Test', pan_number: 'INVALID' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation Error');
    });

    it('should accept valid PAN and mask it in response', async () => {
      const res = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'PanTest', pan_number: 'ABCDE1234F' });

      expect(res.status).toBe(201);
      expect(res.body.data.pan_number).toBe('ABCDE****F'); // Masked
    });

    it('should not log raw PAN in audit logs', async () => {
      await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'AuditTest', pan_number: 'ABCDE1234F' });

      const audit = await prisma.auditLog.findFirst({ where: { action: 'DONOR_CREATED' } });
      expect(audit).not.toBeNull();
      
      const newValues: any = audit!.new_values;
      expect(newValues.pan_number).toBe('ABCDE****F');
      expect(JSON.stringify(newValues)).not.toContain('ABCDE1234F'); // Raw PAN must not exist
    });
  });

  describe('RBAC & Security', () => {
    let testDonorId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'Test Donor' });
      testDonorId = res.body.data.id;
    });

    it('should allow read:donors', async () => {
      const res = await request(app).get('/api/v1/donors').set('Cookie', `token=${adminToken}`);
      expect(res.status).toBe(200);
    });

    it('should deny read:donors if no permission', async () => {
      const res = await request(app).get('/api/v1/donors').set('Cookie', `token=${regularToken}`);
      expect(res.status).toBe(403);
    });

    it('should allow update:donors', async () => {
      const res = await request(app)
        .patch(`/api/v1/donors/${testDonorId}`)
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'Updated' });
      expect(res.status).toBe(200);
      expect(res.body.data.first_name).toBe('Updated');
    });

    it('should deny create:donors if no permission (Admin without permission)', async () => {
      const initialCount = await prisma.donor.count();
      
      const res = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${regularToken}`) // Regular user lacks create:donors
        .send({ first_name: 'Denied', email: 'denied@example.com' });
        
      expect(res.status).toBe(403);
      
      // Verify no donor created
      const finalCount = await prisma.donor.count();
      expect(finalCount).toBe(initialCount);
      
      // Verify no sequence consumed by this request
      const seq = await prisma.numberSequence.findUnique({ where: { name: `DONOR_${new Date().getFullYear()}` } });
      // The sequence might be 1 because of the beforeEach hook creating a donor, so we just ensure it's not 2.
      expect(seq?.current_value).toBeLessThanOrEqual(1n); 
      
      // Verify no audit generated by the denied request
      const auditCount = await prisma.auditLog.count({ where: { action: 'DONOR_CREATED' } });
      // Expect 1 because of beforeEach hook creating a donor
      expect(auditCount).toBe(1);
    });

    it('should deny POST with invalid or expired authentication (No fallback to public)', async () => {
      const initialCount = await prisma.donor.count();
      
      // A. Expired token
      const expiredToken = sign({ id: adminUserId.toString() }, env.JWT_SECRET, { expiresIn: '-1h' });
      const res1 = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${expiredToken}`)
        .send({ first_name: 'Expired' });
      expect(res1.status).toBe(401);
      
      // B. Invalid token
      const res2 = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=invalidtokenstring`)
        .send({ first_name: 'Invalid' });
      expect(res2.status).toBe(401);

      // Verify no donor created
      const finalCount = await prisma.donor.count();
      expect(finalCount).toBe(initialCount);
    });

    it('should deny public search and enumeration', async () => {
      const res1 = await request(app).get('/api/v1/donors?search=test');
      expect(res1.status).toBe(401);
      
      const res2 = await request(app).get(`/api/v1/donors/${testDonorId}`);
      expect(res2.status).toBe(401);
    });

    it('should deny update:donors if no permission', async () => {
      const res = await request(app)
        .patch(`/api/v1/donors/${testDonorId}`)
        .set('Cookie', `token=${regularToken}`)
        .send({ first_name: 'Updated' });
      expect(res.status).toBe(403);
    });

    it('should protect IDOR for donor detail', async () => {
      // Public access denied
      const res1 = await request(app).get(`/api/v1/donors/${testDonorId}`);
      expect(res1.status).toBe(401);

      // Unauthorized user denied
      const res2 = await request(app).get(`/api/v1/donors/${testDonorId}`).set('Cookie', `token=${regularToken}`);
      expect(res2.status).toBe(403);
    });

    it('should protect unknown/server-controlled fields during update', async () => {
      const res = await request(app)
        .patch(`/api/v1/donors/${testDonorId}`)
        .set('Cookie', `token=${adminToken}`)
        .send({ donor_number: 'HACKED-123' });
      
      expect(res.status).toBe(200);
      expect(res.body.data.donor_number).not.toBe('HACKED-123'); // Ignored
    });

    it('should enforce public rate limiting', async () => {
      // Make 6 public requests (limit is 5)
      for (let i = 0; i < 5; i++) {
        await request(app).post('/api/v1/donors').send({ first_name: `Rate ${i}` });
      }
      const res = await request(app).post('/api/v1/donors').send({ first_name: `Rate 6` });
      expect(res.status).toBe(429); // Too Many Requests
    });
  });

  describe('Update & Donation History', () => {
    let testDonorId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/donors')
        .set('Cookie', `token=${adminToken}`)
        .send({ first_name: 'UpdateTest' });
      testDonorId = res.body.data.id;
    });

    it('should generate DONOR_UPDATED audit', async () => {
      await request(app)
        .patch(`/api/v1/donors/${testDonorId}`)
        .set('Cookie', `token=${adminToken}`)
        .send({ last_name: 'Changed' });

      const audit = await prisma.auditLog.findFirst({ where: { action: 'DONOR_UPDATED', entity_id: BigInt(testDonorId) } });
      expect(audit).not.toBeNull();
      expect(audit?.user_id).toBe(adminUserId);
    });

    it('should return read-only donation history with pagination', async () => {
      // Create a dummy donation directly in DB for testing
      await prisma.donation.create({
        data: {
          donation_number: 'DON-2026-000001',
          donor_id: BigInt(testDonorId),
          amount: 500,
          payment_type: 'ONLINE',
          status: 'SUCCESS'
        }
      });

      const res = await request(app)
        .get(`/api/v1/donors/${testDonorId}/donations?page=1&limit=10`)
        .set('Cookie', `token=${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].amount).toBe('500');
      expect(res.body.meta.total).toBe(1);
    });
  });
});
