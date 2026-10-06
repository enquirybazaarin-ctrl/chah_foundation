import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';

const generateToken = (userId: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });

describe('Hero Slide API', () => {
  let adminToken: string;
  let slideId: string;

  beforeAll(async () => {
    // Ensure permission exists
    let createPerm = await prisma.permission.findFirst({ where: { action: 'create', resource: 'cms' } });
    if (!createPerm) createPerm = await prisma.permission.create({ data: { action: 'create', resource: 'cms' } });

    let readPerm = await prisma.permission.findFirst({ where: { action: 'read', resource: 'cms' } });
    if (!readPerm) readPerm = await prisma.permission.create({ data: { action: 'read', resource: 'cms' } });

    let updatePerm = await prisma.permission.findFirst({ where: { action: 'update', resource: 'cms' } });
    if (!updatePerm) updatePerm = await prisma.permission.create({ data: { action: 'update', resource: 'cms' } });

    let deletePerm = await prisma.permission.findFirst({ where: { action: 'delete', resource: 'cms' } });
    if (!deletePerm) deletePerm = await prisma.permission.create({ data: { action: 'delete', resource: 'cms' } });

    let adminRole = await prisma.role.findFirst({ where: { name: 'HERO_SLIDE_ADMIN' } });
    if (!adminRole) {
      adminRole = await prisma.role.create({ data: { name: 'HERO_SLIDE_ADMIN' } });
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
      where: { email: 'heroslideadmin@test.com' },
      update: {},
      create: {
        email: 'heroslideadmin@test.com',
        password_hash: 'hashedpassword',
        first_name: 'Hero',
        last_name: 'Admin',
        role_id: adminRole.id,
      },
    });

    adminToken = generateToken(admin.id.toString());
  });

  afterAll(async () => {
    await prisma.heroSlide.deleteMany({
      where: { title: { contains: 'Test Slide' } },
    });
    await prisma.user.deleteMany({ where: { email: 'heroslideadmin@test.com' } });
    await prisma.rolePermission.deleteMany({
      where: { role: { name: 'HERO_SLIDE_ADMIN' } },
    });
    await prisma.role.deleteMany({ where: { name: 'HERO_SLIDE_ADMIN' } });
  });

  it('should create a new hero slide', async () => {
    const res = await request(app)
      .post('/api/v1/hero-slides')
      .set('Cookie', [`token=${adminToken}`])
      .send({
        tag: '80G Tax Benefit',
        title: 'Test Slide Title',
        highlight: 'decision today.',
        description: 'Test description for slide',
        image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c',
        primary_button_text: 'Donate Now',
        primary_button_url: '/donate',
        sort_order: 1,
        is_active: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.slide).toHaveProperty('id');
    expect(res.body.data.slide.title).toBe('Test Slide Title');
    slideId = res.body.data.slide.id;
  });

  it('should fetch active slides publicly without auth', async () => {
    const res = await request(app).get('/api/v1/hero-slides');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.slides)).toBe(true);
    const found = res.body.data.slides.find((s: any) => s.id === slideId);
    expect(found).toBeDefined();
  });

  it('should update a hero slide', async () => {
    const res = await request(app)
      .put(`/api/v1/hero-slides/${slideId}`)
      .set('Cookie', [`token=${adminToken}`])
      .send({
        title: 'Test Slide Updated Title',
        highlight: 'updated highlight',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.slide.title).toBe('Test Slide Updated Title');
  });

  it('should toggle a hero slide active status', async () => {
    const res = await request(app)
      .patch(`/api/v1/hero-slides/${slideId}/toggle`)
      .set('Cookie', [`token=${adminToken}`])
      .send({ is_active: false });

    expect(res.status).toBe(200);
    expect(res.body.data.slide.is_active).toBe(false);

    // Verify it is not in public active slides
    const publicRes = await request(app).get('/api/v1/hero-slides');
    const found = publicRes.body.data.slides.find((s: any) => s.id === slideId);
    expect(found).toBeUndefined();
  });

  it('should delete a hero slide', async () => {
    const res = await request(app)
      .delete(`/api/v1/hero-slides/${slideId}`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(204);
  });
});
