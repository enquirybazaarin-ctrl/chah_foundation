import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import { sign } from 'jsonwebtoken';
import { env } from '../../src/config/env';

const generateToken = (userId: string, _status?: string) => sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });

describe('CMS API', () => {
  let adminToken: string;
  
  let categoryId: string;
  let tagId: string;
  let blogId: string;

  beforeAll(async () => {
    // Setup Permissions and Role
    const managePerm = await prisma.permission.create({ data: { action: 'manage', resource: 'cms' } });
    const createPerm = await prisma.permission.create({ data: { action: 'create', resource: 'cms' } });
    const updatePerm = await prisma.permission.create({ data: { action: 'update', resource: 'cms' } });
    const deletePerm = await prisma.permission.create({ data: { action: 'delete', resource: 'cms' } });
    
    const adminRole = await prisma.role.create({ data: { name: 'CMS_ADMIN' } });
    await prisma.rolePermission.createMany({
      data: [
        { role_id: adminRole.id, permission_id: managePerm.id },
        { role_id: adminRole.id, permission_id: createPerm.id },
        { role_id: adminRole.id, permission_id: updatePerm.id },
        { role_id: adminRole.id, permission_id: deletePerm.id },
      ]
    });

    const admin = await prisma.user.create({
      data: {
        email: 'cmsadmin@test.com',
        password_hash: 'hashedpassword',
        first_name: 'Admin',
        last_name: 'Test',
        role_id: adminRole.id
      }
    });
    
    adminToken = generateToken(admin.id.toString());
  });

  afterAll(async () => {
    // Cleanup in correct order
    await prisma.blogTag.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.blog.deleteMany({});
    await prisma.blogCategory.deleteMany({});
    
    await prisma.user.deleteMany({ where: { email: 'cmsadmin@test.com' } });
    await prisma.rolePermission.deleteMany({});
    await prisma.role.deleteMany({ where: { name: 'CMS_ADMIN' } });
    await prisma.permission.deleteMany({ where: { resource: 'cms' } });
  });

  // ----------------------------------------------------
  // Blog Categories
  // ----------------------------------------------------
  it('should create a blog category', async () => {
    const res = await request(app)
      .post('/api/v1/cms/categories')
      .set('Cookie', [`token=${adminToken}`])
      .send({ name: 'Tech Innovations' });

    expect(res.status).toBe(201);
    expect(res.body.data.category).toHaveProperty('id');
    expect(res.body.data.category.slug).toBe('tech-innovations');
    categoryId = res.body.data.category.id;
  });

  it('should get all blog categories', async () => {
    const res = await request(app).get('/api/v1/cms/categories');
    expect(res.status).toBe(200);
    expect(res.body.data.categories.length).toBeGreaterThan(0);
  });

  // ----------------------------------------------------
  // Tags
  // ----------------------------------------------------
  it('should create a tag', async () => {
    const res = await request(app)
      .post('/api/v1/cms/tags')
      .set('Cookie', [`token=${adminToken}`])
      .send({ name: 'Web Development' });

    expect(res.status).toBe(201);
    expect(res.body.data.tag).toHaveProperty('id');
    expect(res.body.data.tag.slug).toBe('web-development');
    tagId = res.body.data.tag.id;
  });

  it('should get all tags', async () => {
    const res = await request(app).get('/api/v1/cms/tags');
    expect(res.status).toBe(200);
    expect(res.body.data.tags.length).toBeGreaterThan(0);
  });

  // ----------------------------------------------------
  // Blogs
  // ----------------------------------------------------
  it('should create a blog', async () => {
    const res = await request(app)
      .post('/api/v1/cms/blogs')
      .set('Cookie', [`token=${adminToken}`])
      .send({
        title: 'Building a CMS',
        category_id: parseInt(categoryId, 10),
        content: 'This is a test blog content.',
        status: 'PUBLISHED',
        tag_ids: [parseInt(tagId, 10)]
      });

    expect(res.status).toBe(201);
    expect(res.body.data.blog).toHaveProperty('id');
    expect(res.body.data.blog.slug).toBe('building-a-cms');
    expect(res.body.data.blog.blog_tags.length).toBe(1);
    blogId = res.body.data.blog.id;
  });

  it('should get all blogs', async () => {
    const res = await request(app).get('/api/v1/cms/blogs');
    expect(res.status).toBe(200);
    expect(res.body.data.blogs.length).toBeGreaterThan(0);
  });

  it('should prevent category deletion if a blog is attached', async () => {
    const res = await request(app)
      .delete(`/api/v1/cms/categories/${categoryId}`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(400); // Because it is attached to a blog
  });

  it('should archive a blog (status update)', async () => {
    const res = await request(app)
      .patch(`/api/v1/cms/blogs/${blogId}/status`)
      .set('Cookie', [`token=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.blog.status).toBe('ARCHIVED');
  });
});
