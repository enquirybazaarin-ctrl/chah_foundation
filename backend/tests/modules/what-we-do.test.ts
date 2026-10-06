import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';

const generateToken = (userId: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });

describe('What We Do API', () => {
  let adminToken: string;
  let cardId: string;

  beforeAll(async () => {
    let createPerm = await prisma.permission.findFirst({ where: { action: 'create', resource: 'cms' } });
    if (!createPerm) createPerm = await prisma.permission.create({ data: { action: 'create', resource: 'cms' } });

    let readPerm = await prisma.permission.findFirst({ where: { action: 'read', resource: 'cms' } });
    if (!readPerm) readPerm = await prisma.permission.create({ data: { action: 'read', resource: 'cms' } });

    let updatePerm = await prisma.permission.findFirst({ where: { action: 'update', resource: 'cms' } });
    if (!updatePerm) updatePerm = await prisma.permission.create({ data: { action: 'update', resource: 'cms' } });

    let deletePerm = await prisma.permission.findFirst({ where: { action: 'delete', resource: 'cms' } });
    if (!deletePerm) deletePerm = await prisma.permission.create({ data: { action: 'delete', resource: 'cms' } });

    let adminRole = await prisma.role.findFirst({ where: { name: 'WHAT_WE_DO_ADMIN' } });
    if (!adminRole) {
      adminRole = await prisma.role.create({ data: { name: 'WHAT_WE_DO_ADMIN' } });
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
      where: { email: 'whatwedoadmin@test.com' },
      update: {},
      create: {
        email: 'whatwedoadmin@test.com',
        password_hash: 'hashedpassword',
        first_name: 'WhatWeDo',
        last_name: 'Admin',
        role_id: adminRole.id,
      },
    });

    adminToken = generateToken(admin.id.toString());
  });

  afterAll(async () => {
    await prisma.whatWeDoCard.deleteMany({
      where: { title: { contains: 'Test Cause Card' } },
    });
    await prisma.user.deleteMany({ where: { email: 'whatwedoadmin@test.com' } });
    await prisma.rolePermission.deleteMany({
      where: { role: { name: 'WHAT_WE_DO_ADMIN' } },
    });
    await prisma.role.deleteMany({ where: { name: 'WHAT_WE_DO_ADMIN' } });
  });

  it('should fetch public what-we-do data without auth', async () => {
    const res = await request(app).get('/api/v1/what-we-do');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('cards');
    expect(res.body.data).toHaveProperty('section');
    expect(Array.isArray(res.body.data.cards)).toBe(true);
  });

  it('should create a new cause card via admin', async () => {
    const res = await request(app)
      .post('/api/v1/what-we-do')
      .set('Cookie', [`token=${adminToken}`])
      .send({
        title: 'Test Cause Card',
        badge: 'TEST BADGE',
        icon_type: 'essentials',
        accent_color: '#1e88e5',
        description: 'Test description for unit testing cause cards.',
        images: ['https://images.unsplash.com/photo-1593113580332-ce288d6168e9'],
        cta_text: 'Know More',
        cta_link: '/campaigns',
        sort_order: 10,
        is_active: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.card).toHaveProperty('id');
    expect(res.body.data.card.title).toBe('Test Cause Card');
    cardId = res.body.data.card.id;
  });

  it('should update section settings', async () => {
    const res = await request(app)
      .put('/api/v1/what-we-do/settings')
      .set('Cookie', [`token=${adminToken}`])
      .send({
        badge: 'UPDATED BADGE',
        heading: 'Updated Supporting Citizens Heading',
        subheading: 'Updated subheading for testing.',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.section.badge).toBe('UPDATED BADGE');
    expect(res.body.data.section.heading).toBe('Updated Supporting Citizens Heading');
  });

  it('should update a cause card', async () => {
    const res = await request(app)
      .put(`/api/v1/what-we-do/${cardId}`)
      .set('Cookie', [`token=${adminToken}`])
      .send({
        title: 'Test Cause Card Updated',
        description: 'Updated cause card description.',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.card.title).toBe('Test Cause Card Updated');
  });

  it('should toggle a cause card active status', async () => {
    const res = await request(app)
      .patch(`/api/v1/what-we-do/${cardId}/toggle`)
      .set('Cookie', [`token=${adminToken}`])
      .send({ is_active: false });

    expect(res.status).toBe(200);
    expect(res.body.data.card.is_active).toBe(false);
  });

  it('should delete a cause card', async () => {
    const res = await request(app)
      .delete(`/api/v1/what-we-do/${cardId}`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(204);
  });
});
