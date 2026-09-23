import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';
const generateToken = (userId: string, _status?: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });

describe('Campaign Category Module', () => {
  let adminToken: string;
  
  let pCreate: any;
  let pRead: any;
  let pUpdate: any;
  

  beforeAll(async () => {
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
    

    const adminRole = await prisma.role.create({ data: { name: 'CatAdmin' } });

    await prisma.rolePermission.createMany({
      data: [
        { role_id: adminRole.id, permission_id: pCreate.id },
        { role_id: adminRole.id, permission_id: pRead.id },
        { role_id: adminRole.id, permission_id: pUpdate.id },
      ]
    });

    const admin = await prisma.user.create({
      data: {
        first_name: 'Admin',
        last_name: 'Cat',
        email: 'admin.cat@chah.test',
        password_hash: 'hashed',
        role_id: adminRole.id
      }
    });
    
    adminToken = generateToken(admin.id.toString(), 'ACTIVE');
  });

  afterAll(async () => {
    await prisma.campaign.deleteMany();
    await prisma.campaignCategory.deleteMany();
    await prisma.user.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
  });

  afterEach(async () => {
    await prisma.campaign.deleteMany();
    await prisma.campaignCategory.deleteMany();
  });

  it('should create category with unique slug', async () => {
    const res = await request(app)
      .post('/api/v1/campaign-categories')
      .set('Cookie', `token=${adminToken}`)
      .send({ name: 'Education', description: 'Desc' });
    
    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe('education');
  });

  it('should handle duplicate slugs automatically', async () => {
    await request(app)
      .post('/api/v1/campaign-categories')
      .set('Cookie', `token=${adminToken}`)
      .send({ name: 'Education' });

    const res2 = await request(app)
      .post('/api/v1/campaign-categories')
      .set('Cookie', `token=${adminToken}`)
      .send({ name: 'Education' });
    
    expect(res2.status).toBe(201);
    expect(res2.body.data.slug).toBe('education-1');
  });

  it('should update category and regenerate slug if name changes', async () => {
    const res = await request(app)
      .post('/api/v1/campaign-categories')
      .set('Cookie', `token=${adminToken}`)
      .send({ name: 'Old Name' });
    const id = res.body.data.id;

    const updateRes = await request(app)
      .patch(`/api/v1/campaign-categories/${id}`)
      .set('Cookie', `token=${adminToken}`)
      .send({ name: 'New Name' });
    
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.slug).toBe('new-name');
  });
});
