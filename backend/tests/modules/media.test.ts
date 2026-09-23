import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';
const generateToken = (userId: string, _status?: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });
import path from 'path';
import fs from 'fs';

describe('Media API', () => {
  let adminToken: string;
  let mediaId: string;
  let uploadedFilename: string;

  beforeAll(async () => {
    const permission = await prisma.permission.create({ data: { action: 'manage', resource: 'media' } });
    const adminRole = await prisma.role.create({ data: { name: 'MEDIA_ADMIN' } });
    await prisma.rolePermission.create({ data: { role_id: adminRole.id, permission_id: permission.id } });

    // Create an admin user to get the token
    const admin = await prisma.user.create({
      data: {
        email: 'mediaadmin@test.com',
        password_hash: 'hashedpassword',
        first_name: 'Admin',
        last_name: 'Test',
        role_id: adminRole.id
      }
    });

    adminToken = generateToken(admin.id.toString());
  });

  afterAll(async () => {
    // Cleanup physical files if any were uploaded
    if (uploadedFilename) {
      try {
        const filePath = path.join(process.cwd(), 'uploads', uploadedFilename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (e) {
        console.error('Failed to cleanup test file', e);
      }
    }

    await prisma.media.deleteMany({});
    await prisma.album.deleteMany({});
    await prisma.user.deleteMany({ where: { email: 'mediaadmin@test.com' } });
    await prisma.role.deleteMany({ where: { name: 'MEDIA_ADMIN' } });
  });

  it('should upload a new media file', async () => {
    const res = await request(app)
      .post('/api/v1/media')
      .set('Cookie', [`token=${adminToken}`])
      .attach('file', Buffer.from('fake image data'), {
        filename: 'test.jpg',
        contentType: 'image/jpeg'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.media).toHaveProperty('id');
    expect(res.body.data.media.url).toContain('/media/');
    
    mediaId = res.body.data.media.id;
    uploadedFilename = res.body.data.media.filename;
  });

  it('should reject invalid file types', async () => {
    const res = await request(app)
      .post('/api/v1/media')
      .set('Cookie', [`token=${adminToken}`])
      .attach('file', Buffer.from('fake document data'), {
        filename: 'test.pdf',
        contentType: 'application/pdf'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid file type');
  });

  it('should get all media', async () => {
    const res = await request(app)
      .get('/api/v1/media')
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.media)).toBe(true);
    expect(res.body.data.media.length).toBeGreaterThan(0);
  });

  it('should update media metadata', async () => {
    const res = await request(app)
      .patch(`/api/v1/media/${mediaId}`)
      .set('Cookie', [`token=${adminToken}`])
      .send({
        alt_text: 'An updated alt text'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.media.alt_text).toBe('An updated alt text');
  });

  it('should delete a media record and file', async () => {
    const res = await request(app)
      .delete(`/api/v1/media/${mediaId}`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(204);

    // Verify file is actually deleted
    const filePath = path.join(process.cwd(), 'uploads', uploadedFilename);
    expect(fs.existsSync(filePath)).toBe(false);
  });
});
