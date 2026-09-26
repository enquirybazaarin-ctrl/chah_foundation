import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';

const generateToken = (userId: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });

describe('Operations API', () => {
  let adminToken: string;
  let adminId: bigint;
  let enquiryId: string;
  
  beforeAll(async () => {
    // Setup Permissions and Role
    const opsReadPerm = await prisma.permission.create({ data: { action: 'read', resource: 'operations' } });
    const opsUpdatePerm = await prisma.permission.create({ data: { action: 'update', resource: 'operations' } });
    const settingsManagePerm = await prisma.permission.create({ data: { action: 'manage', resource: 'settings' } });
    const auditReadPerm = await prisma.permission.create({ data: { action: 'read', resource: 'audit_logs' } });
    
    const adminRole = await prisma.role.create({ data: { name: 'OPERATIONS_ADMIN' } });
    await prisma.rolePermission.createMany({
      data: [
        { role_id: adminRole.id, permission_id: opsReadPerm.id },
        { role_id: adminRole.id, permission_id: opsUpdatePerm.id },
        { role_id: adminRole.id, permission_id: settingsManagePerm.id },
        { role_id: adminRole.id, permission_id: auditReadPerm.id }
      ]
    });

    const admin = await prisma.user.create({
      data: {
        email: 'opsadmin@test.com',
        password_hash: 'hashedpassword',
        first_name: 'Ops',
        last_name: 'Admin',
        role_id: adminRole.id
      }
    });
    adminId = admin.id;
    adminToken = generateToken(admin.id.toString());
  });

  afterAll(async () => {
    await prisma.auditLog.deleteMany({});
    await prisma.setting.deleteMany({});
    await prisma.newsletterSubscriber.deleteMany({});
    await prisma.contactEnquiry.deleteMany({});
    
    await prisma.user.deleteMany({ where: { email: 'opsadmin@test.com' } });
    await prisma.rolePermission.deleteMany({});
    await prisma.role.deleteMany({ where: { name: 'OPERATIONS_ADMIN' } });
    await prisma.permission.deleteMany({ 
      where: { 
        resource: { in: ['operations', 'settings', 'audit_logs'] } 
      } 
    });
  });

  // ----------------------------------------------------
  // Contact Enquiries
  // ----------------------------------------------------
  it('should submit a contact enquiry', async () => {
    const res = await request(app)
      .post('/api/v1/operations/contact')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Volunteering',
        message: 'I want to help.'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.enquiry.status).toBe('UNREAD');
    enquiryId = res.body.data.enquiry.id;
  });

  it('should fetch enquiries (admin only)', async () => {
    const res = await request(app)
      .get('/api/v1/operations/enquiries')
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.enquiries.length).toBe(1);
  });

  it('should update enquiry status', async () => {
    const res = await request(app)
      .patch(`/api/v1/operations/enquiries/${enquiryId}/status`)
      .set('Cookie', [`token=${adminToken}`])
      .send({ status: 'RESOLVED' });

    expect(res.status).toBe(200);
    expect(res.body.data.enquiry.status).toBe('RESOLVED');
  });

  // ----------------------------------------------------
  // Newsletter
  // ----------------------------------------------------
  it('should subscribe to newsletter', async () => {
    const res = await request(app)
      .post('/api/v1/operations/newsletter')
      .send({ email: 'news@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.data.subscriber.email).toBe('news@example.com');
  });

  it('should not duplicate newsletter subscription but return success', async () => {
    const res = await request(app)
      .post('/api/v1/operations/newsletter')
      .send({ email: 'news@example.com' });

    expect(res.status).toBe(200); // Idempotent success
  });

  // ----------------------------------------------------
  // Settings
  // ----------------------------------------------------
  it('should upsert a setting (admin only)', async () => {
    const res = await request(app)
      .post('/api/v1/operations/settings')
      .set('Cookie', [`token=${adminToken}`])
      .send({ setting_key: 'NGO_CONTACT_EMAIL', setting_value: 'hello@chah.org' });

    expect(res.status).toBe(200);
    expect(res.body.data.setting.setting_value).toBe('hello@chah.org');
  });

  it('should fetch public settings without token', async () => {
    const res = await request(app).get('/api/v1/operations/settings/public');
    expect(res.status).toBe(200);
    expect(res.body.data.settings.length).toBe(1);
    expect(res.body.data.settings[0].setting_key).toBe('NGO_CONTACT_EMAIL');
  });

  // ----------------------------------------------------
  // Audit Logs
  // ----------------------------------------------------
  it('should create an audit log programmatically and fetch it', async () => {
    // Internal Service Call Simulation
    const { operationsService } = await import('../../src/modules/operations/operations.service');
    await operationsService.logAction('TEST_ACTION', 'USER', BigInt(1), adminId, null, { field: 'val' });

    const res = await request(app)
      .get('/api/v1/operations/audit-logs')
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.logs.length).toBeGreaterThan(0);
    expect(res.body.data.logs[0].action).toBe('TEST_ACTION');
  });
});
