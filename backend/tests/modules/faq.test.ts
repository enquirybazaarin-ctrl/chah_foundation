import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';
const generateToken = (userId: string, _status?: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });

describe('FAQ API', () => {
  let adminToken: string;
  let faqId: string;

  beforeAll(async () => {
    const createPerm = await prisma.permission.create({ data: { action: 'create', resource: 'faqs' } }); const updatePerm = await prisma.permission.create({ data: { action: 'update', resource: 'faqs' } }); const deletePerm = await prisma.permission.create({ data: { action: 'delete', resource: 'faqs' } });
    const adminRole = await prisma.role.create({ data: { name: 'FAQ_ADMIN' } });
    await prisma.rolePermission.createMany({ data: [{ role_id: adminRole.id, permission_id: createPerm.id }, { role_id: adminRole.id, permission_id: updatePerm.id }, { role_id: adminRole.id, permission_id: deletePerm.id }] });

    const admin = await prisma.user.create({
      data: {
        email: 'faqadmin@test.com',
        password_hash: 'hashedpassword',
        first_name: 'Admin',
        last_name: 'Test',
        role_id: adminRole.id
      }
    });

    adminToken = generateToken(admin.id.toString());
  });

  afterAll(async () => {
    await prisma.faq.deleteMany({});
    await prisma.user.deleteMany({ where: { email: 'faqadmin@test.com' } });
    await prisma.rolePermission.deleteMany({});
    await prisma.role.deleteMany({ where: { name: 'FAQ_ADMIN' } });
    await prisma.permission.deleteMany({ where: { resource: 'faqs' } });
  });

  it('should create a new faq', async () => {
    const res = await request(app)
      .post('/api/v1/faqs')
      .set('Cookie', [`token=${adminToken}`])
      .send({
        question: 'What is CHAH?',
        answer: 'We are an NGO.',
        is_published: true
      });

    expect(res.status).toBe(201);
    expect(res.body.data.faq).toHaveProperty('id');
    expect(res.body.data.faq.question).toBe('What is CHAH?');
    faqId = res.body.data.faq.id;
  });

  it('should get all faqs', async () => {
    const res = await request(app)
      .get('/api/v1/faqs')
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.faqs)).toBe(true);
    expect(res.body.data.faqs.length).toBeGreaterThan(0);
  });

  it('should update an faq', async () => {
    const res = await request(app)
      .patch(`/api/v1/faqs/${faqId}`)
      .set('Cookie', [`token=${adminToken}`])
      .send({
        question: 'Updated Question'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.faq.question).toBe('Updated Question');
  });

  it('should delete an faq', async () => {
    const res = await request(app)
      .delete(`/api/v1/faqs/${faqId}`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(204);
  });
});
