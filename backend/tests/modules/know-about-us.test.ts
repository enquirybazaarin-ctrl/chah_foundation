import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';

const generateToken = (userId: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });

describe('Know About Us API', () => {
  let adminToken: string;

  beforeAll(async () => {
    let createPerm = await prisma.permission.findFirst({ where: { action: 'create', resource: 'cms' } });
    if (!createPerm) createPerm = await prisma.permission.create({ data: { action: 'create', resource: 'cms' } });

    let readPerm = await prisma.permission.findFirst({ where: { action: 'read', resource: 'cms' } });
    if (!readPerm) readPerm = await prisma.permission.create({ data: { action: 'read', resource: 'cms' } });

    let updatePerm = await prisma.permission.findFirst({ where: { action: 'update', resource: 'cms' } });
    if (!updatePerm) updatePerm = await prisma.permission.create({ data: { action: 'update', resource: 'cms' } });

    let deletePerm = await prisma.permission.findFirst({ where: { action: 'delete', resource: 'cms' } });
    if (!deletePerm) deletePerm = await prisma.permission.create({ data: { action: 'delete', resource: 'cms' } });

    let adminRole = await prisma.role.findFirst({ where: { name: 'KNOW_ABOUT_US_TEST_ADMIN' } });
    if (!adminRole) {
      adminRole = await prisma.role.create({ data: { name: 'KNOW_ABOUT_US_TEST_ADMIN' } });
      await prisma.rolePermission.createMany({
        data: [
          { role_id: adminRole.id, permission_id: createPerm.id },
          { role_id: adminRole.id, permission_id: readPerm.id },
          { role_id: adminRole.id, permission_id: updatePerm.id },
          { role_id: adminRole.id, permission_id: deletePerm.id },
        ],
      });
    }

    const admin = await prisma.user.upsert({
      where: { email: 'knowaboutustest@test.com' },
      update: {},
      create: {
        email: 'knowaboutustest@test.com',
        password_hash: 'hashedpassword',
        first_name: 'KnowAboutUs',
        last_name: 'Admin',
        role_id: adminRole.id,
      },
    });

    adminToken = generateToken(admin.id.toString());
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'knowaboutustest@test.com' } });
    await prisma.rolePermission.deleteMany({
      where: { role: { name: 'KNOW_ABOUT_US_TEST_ADMIN' } },
    });
    await prisma.role.deleteMany({ where: { name: 'KNOW_ABOUT_US_TEST_ADMIN' } });
  });

  it('GET /api/v1/know-about-us should return public data', async () => {
    const res = await request(app).get('/api/v1/know-about-us');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('heading');
    expect(res.body.data).toHaveProperty('images');
    expect(Array.isArray(res.body.data.images)).toBe(true);
  });

  it('PUT /api/v1/know-about-us should update content when authenticated', async () => {
    const res = await request(app)
      .put('/api/v1/know-about-us')
      .set('Cookie', [`token=${adminToken}`])
      .send({
        heading: 'About Us',
        heading_highlight: 'Us',
        quote: 'Every child deserves hope. Every smile matters.',
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.heading).toBe('About Us');
    expect(res.body.data.heading_highlight).toBe('Us');
    expect(res.body.data.quote).toBe('Every child deserves hope. Every smile matters.');
  });

  it('POST /api/v1/know-about-us/images should add an image to slider', async () => {
    const testImage = 'https://images.unsplash.com/photo-test-12345';
    const res = await request(app)
      .post('/api/v1/know-about-us/images')
      .set('Cookie', [`token=${adminToken}`])
      .send({ image_url: testImage });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.images).toContain(testImage);
  });

  it('POST /api/v1/know-about-us/images/delete should delete an image by index', async () => {
    // Fetch current data to find index
    const currentRes = await request(app).get('/api/v1/know-about-us');
    const images: string[] = currentRes.body.data.images;
    const lastIndex = images.length - 1;

    const res = await request(app)
      .post('/api/v1/know-about-us/images/delete')
      .set('Cookie', [`token=${adminToken}`])
      .send({ index: lastIndex });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.images.length).toBe(images.length - 1);
  });
});
