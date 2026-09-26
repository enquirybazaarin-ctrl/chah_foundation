import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';
const generateToken = (userId: string, _status?: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });

describe('Testimonial API', () => {
  let adminToken: string;
  let testimonialId: string;

  beforeAll(async () => {
    const createPerm = await prisma.permission.create({ data: { action: 'create', resource: 'testimonials' } }); const updatePerm = await prisma.permission.create({ data: { action: 'update', resource: 'testimonials' } }); const deletePerm = await prisma.permission.create({ data: { action: 'delete', resource: 'testimonials' } });
    const adminRole = await prisma.role.create({ data: { name: 'TESTIMONIAL_ADMIN' } });
    await prisma.rolePermission.createMany({ data: [{ role_id: adminRole.id, permission_id: createPerm.id }, { role_id: adminRole.id, permission_id: updatePerm.id }, { role_id: adminRole.id, permission_id: deletePerm.id }] });

    const admin = await prisma.user.create({
      data: {
        email: 'testimonialadmin@test.com',
        password_hash: 'hashedpassword',
        first_name: 'Admin',
        last_name: 'Test',
        role_id: adminRole.id
      }
    });

    adminToken = generateToken(admin.id.toString());
  });

  afterAll(async () => {
    await prisma.testimonial.deleteMany({});
    await prisma.user.deleteMany({ where: { email: 'testimonialadmin@test.com' } });
    await prisma.rolePermission.deleteMany({});
    await prisma.role.deleteMany({ where: { name: 'TESTIMONIAL_ADMIN' } });
    await prisma.permission.deleteMany({ where: { resource: 'testimonials' } });
  });

  it('should create a new testimonial', async () => {
    const res = await request(app)
      .post('/api/v1/testimonials')
      .set('Cookie', [`token=${adminToken}`])
      .send({
        author_name: 'John Doe',
        content: 'This NGO is great!',
        is_published: true
      });

    expect(res.status).toBe(201);
    expect(res.body.data.testimonial).toHaveProperty('id');
    testimonialId = res.body.data.testimonial.id;
  });

  it('should get all testimonials', async () => {
    const res = await request(app).get('/api/v1/testimonials');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.testimonials)).toBe(true);
    expect(res.body.data.testimonials.length).toBeGreaterThan(0);
  });

  it('should update a testimonial', async () => {
    const res = await request(app)
      .patch(`/api/v1/testimonials/${testimonialId}`)
      .set('Cookie', [`token=${adminToken}`])
      .send({
        author_name: 'Jane Doe'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.testimonial.author_name).toBe('Jane Doe');
  });

  it('should delete a testimonial', async () => {
    const res = await request(app)
      .delete(`/api/v1/testimonials/${testimonialId}`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(204);
  });
});
