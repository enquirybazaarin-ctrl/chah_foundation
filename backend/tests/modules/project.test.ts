import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';
const generateToken = (userId: string, _status?: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });

describe('Project API', () => {
  let adminToken: string;
  let projectId: string;
  let activityId: string;

  beforeAll(async () => {
    const createPerm = await prisma.permission.create({ data: { action: 'create', resource: 'projects' } }); const updatePerm = await prisma.permission.create({ data: { action: 'update', resource: 'projects' } }); const deletePerm = await prisma.permission.create({ data: { action: 'delete', resource: 'projects' } });
    const adminRole = await prisma.role.create({ data: { name: 'PROJECT_ADMIN' } });
    await prisma.rolePermission.createMany({ data: [{ role_id: adminRole.id, permission_id: createPerm.id }, { role_id: adminRole.id, permission_id: updatePerm.id }, { role_id: adminRole.id, permission_id: deletePerm.id }] });

    const admin = await prisma.user.create({
      data: {
        email: 'projectadmin@test.com',
        password_hash: 'hashedpassword',
        first_name: 'Admin',
        last_name: 'Test',
        role_id: adminRole.id
      }
    });

    adminToken = generateToken(admin.id.toString());
  });

  afterAll(async () => {
    await prisma.activity.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({ where: { email: 'projectadmin@test.com' } });
    await prisma.rolePermission.deleteMany({});
    await prisma.role.deleteMany({ where: { name: 'PROJECT_ADMIN' } });
    await prisma.permission.deleteMany({ where: { resource: 'projects' } });
  });

  it('should create a new project', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Cookie', [`token=${adminToken}`])
      .send({
        title: 'Water for all',
        description: 'Providing clean water',
        status: 'PUBLISHED'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.project).toHaveProperty('id');
    expect(res.body.data.project.slug).toBe('water-for-all');
    projectId = res.body.data.project.id;
  });

  it('should get all projects', async () => {
    const res = await request(app).get('/api/v1/projects');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.projects)).toBe(true);
    expect(res.body.data.projects.length).toBeGreaterThan(0);
  });

  it('should create a project activity', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/activities`)
      .set('Cookie', [`token=${adminToken}`])
      .send({
        title: 'Digging first well',
        description: 'We started digging today'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.activity).toHaveProperty('id');
    activityId = res.body.data.activity.id;
  });

  it('should archive a project (status update)', async () => {
    const res = await request(app)
      .patch(`/api/v1/projects/${projectId}/status`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.project.status).toBe('ARCHIVED');
  });

  it('should delete a project activity', async () => {
    const res = await request(app)
      .delete(`/api/v1/projects/${projectId}/activities/${activityId}`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(204);
  });
});
