import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';
const generateToken = (userId: string, _status?: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });

describe('Album API', () => {
  let adminToken: string;
  let albumId: string;

  beforeAll(async () => {
    const permission = await prisma.permission.create({ data: { action: 'manage', resource: 'media' } });
    const adminRole = await prisma.role.create({ data: { name: 'ALBUM_ADMIN' } });
    await prisma.rolePermission.create({ data: { role_id: adminRole.id, permission_id: permission.id } });

    // Create an admin user to get the token
    const admin = await prisma.user.create({
      data: {
        email: 'albumadmin@test.com',
        password_hash: 'hashedpassword',
        first_name: 'Admin',
        last_name: 'Test',
        role_id: adminRole.id
      }
    });

    adminToken = generateToken(admin.id.toString());
  });

  afterAll(async () => {
    await prisma.media.deleteMany({});
    await prisma.album.deleteMany({});
    await prisma.user.deleteMany({ where: { email: 'albumadmin@test.com' } });
    await prisma.role.deleteMany({ where: { name: 'ALBUM_ADMIN' } });
    await prisma.permission.deleteMany({ where: { action: 'manage', resource: 'media' } });
  });

  it('should create a new album', async () => {
    const res = await request(app)
      .post('/api/v1/albums')
      .set('Cookie', [`token=${adminToken}`])
      .send({
        name: 'Test Album',
        description: 'A test album'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.album).toHaveProperty('id');
    expect(res.body.data.album.name).toBe('Test Album');
    albumId = res.body.data.album.id;
  });

  it('should get all albums', async () => {
    const res = await request(app)
      .get('/api/v1/albums')
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.albums)).toBe(true);
    expect(res.body.data.albums.length).toBeGreaterThan(0);
  });

  it('should update an album', async () => {
    const res = await request(app)
      .patch(`/api/v1/albums/${albumId}`)
      .set('Cookie', [`token=${adminToken}`])
      .send({
        name: 'Updated Album Name'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.album.name).toBe('Updated Album Name');
  });

  it('should get an album by id', async () => {
    const res = await request(app)
      .get(`/api/v1/albums/${albumId}`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.album.id).toBe(albumId);
    expect(res.body.data.album.name).toBe('Updated Album Name');
  });

  it('should delete an album', async () => {
    const res = await request(app)
      .delete(`/api/v1/albums/${albumId}`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(204);
  });
});
