import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import slugify from 'slugify';
import { z } from 'zod';
import * as dotenv from 'dotenv';

// 1. Guard against production
if (process.env.NODE_ENV === 'production') {
  console.error('❌ FATAL: Database seeding is strictly prohibited in production environments.');
  process.exit(1);
}

// 2. Load environment variables
dotenv.config();

// 3. Validate credentials
const envSchema = z.object({
  SEED_ADMIN_EMAIL: z.string().email('Invalid SEED_ADMIN_EMAIL format'),
  SEED_ADMIN_PASSWORD: z.string().min(8, 'SEED_ADMIN_PASSWORD must be at least 8 characters long'),
});

const envParsed = envSchema.safeParse(process.env);
if (!envParsed.success) {
  console.error('❌ FATAL: Missing or invalid seed credentials in environment variables.');
  console.error(envParsed.error.format());
  console.error('Please set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD.');
  process.exit(1);
}

const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = envParsed.data;

const prisma = new PrismaClient();
const makeSlug = (text: string) => slugify(text, { lower: true, strict: true, trim: true });

async function main() {
  console.log('🌱 Starting safe, idempotent database seed...');

  // ==========================================
  // SEED AUTH & ROLES
  // ==========================================
  console.log('🔑 Upserting Auth & Roles...');
  
  const roles = ['SUPER_ADMIN', 'MANAGER', 'FINANCE', 'EDITOR', 'SUPPORT'];
  const roleMap: Record<string, any> = {};
  
  for (const roleName of roles) {
    roleMap[roleName] = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName }
    });
  }

  const superAdminRole = roleMap['SUPER_ADMIN'];

  const resources = ['users', 'donors', 'donations', 'campaigns', 'cms', 'operations', 'settings', 'audit_logs', 'metrics', 'projects'];
  const actions = ['create', 'read', 'update', 'delete', 'manage'];

  for (const resource of resources) {
    for (const action of actions) {
      let perm = await prisma.permission.findFirst({ where: { action, resource } });
      if (!perm) perm = await prisma.permission.create({ data: { action, resource } });
      
      const permId = perm.id;

      const assign = async (roleName: string) => {
        const rId = roleMap[roleName].id;
        const exists = await prisma.rolePermission.findFirst({ where: { role_id: rId, permission_id: permId } });
        if (!exists) await prisma.rolePermission.create({ data: { role_id: rId, permission_id: permId } });
      };

      // Assign to SUPER_ADMIN
      await assign('SUPER_ADMIN');

      // MANAGER: Manage operations, donors, campaigns, cms, projects, metrics
      if (['donors', 'donations', 'campaigns', 'cms', 'projects', 'operations', 'metrics'].includes(resource)) {
        await assign('MANAGER');
      }
      if (resource === 'users' && action === 'read') await assign('MANAGER');

      // FINANCE: Manage donations, read donors and operations
      if (['donations'].includes(resource)) await assign('FINANCE');
      if (['donors', 'operations'].includes(resource) && action === 'read') await assign('FINANCE');

      // EDITOR: Manage campaigns, projects, cms
      if (['campaigns', 'projects', 'cms'].includes(resource)) await assign('EDITOR');

      // SUPPORT: Manage operations (enquiries), read donors and donations
      if (['operations'].includes(resource)) await assign('SUPPORT');
      if (['donors', 'donations'].includes(resource) && action === 'read') await assign('SUPPORT');
    }
  }

  // Create or Update Super Admin User
  const password_hash = await argon2.hash(SEED_ADMIN_PASSWORD);
  await prisma.user.upsert({
    where: { email: SEED_ADMIN_EMAIL },
    update: {
      password_hash,
      status: 'ACTIVE',
      role_id: superAdminRole.id
    },
    create: {
      email: SEED_ADMIN_EMAIL,
      password_hash,
      first_name: 'Super',
      last_name: 'Admin',
      status: 'ACTIVE',
      role_id: superAdminRole.id
    }
  });

  // ==========================================
  // SEED SETTINGS
  // ==========================================
  console.log('⚙️ Upserting Global Settings...');
  const settings = [
    { setting_key: 'NGO_CONTACT_EMAIL', setting_value: 'contact@chahfoundation.org' },
    { setting_key: 'NGO_CONTACT_PHONE', setting_value: '+91 9876543210' },
    { setting_key: 'NGO_ADDRESS', setting_value: '123 Foundation Lane, Delhi, India' },
    { setting_key: 'SOCIAL_FACEBOOK', setting_value: 'https://facebook.com/chahfoundation' },
    { setting_key: 'SOCIAL_INSTAGRAM', setting_value: 'https://instagram.com/chahfoundation' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { setting_key: s.setting_key },
      update: { setting_value: s.setting_value },
      create: s
    });
  }

  // ==========================================
  // SEED MEDIA & CMS
  // ==========================================
  console.log('📝 Upserting Media & CMS...');
  
  let album = await prisma.album.findFirst({ where: { name: 'General Seed Album' } });
  if (!album) {
    album = await prisma.album.create({ data: { name: 'General Seed Album', description: 'Seed Images' } });
  }
  
  let mockImage = await prisma.media.findFirst({ where: { filename: 'seed_sample.jpg' } });
  if (!mockImage) {
    mockImage = await prisma.media.create({
      data: {
        filename: 'seed_sample.jpg',
        url: 'https://images.unsplash.com/photo-1593113565694-c6f8716c0296',
        mime_type: 'image/jpeg',
        file_size: 102400,
        album_id: album.id
      }
    });
  }

  const catStoriesSlug = makeSlug('Community Stories');
  const catStories = await prisma.blogCategory.upsert({
    where: { slug: catStoriesSlug },
    update: {},
    create: { name: 'Community Stories', slug: catStoriesSlug }
  });

  const tagEduSlug = makeSlug('Education');
  const tagEdu = await prisma.tag.upsert({
    where: { slug: tagEduSlug },
    update: {},
    create: { name: 'Education', slug: tagEduSlug }
  });

  const adminUser = await prisma.user.findUniqueOrThrow({ where: { email: SEED_ADMIN_EMAIL } });

  const blog1Slug = makeSlug('Our First Education Drive Seed');
  await prisma.blog.upsert({
    where: { slug: blog1Slug },
    update: {
      status: 'PUBLISHED',
      category_id: catStories.id,
      author_id: adminUser.id,
      featured_image_id: mockImage.id
    },
    create: {
      title: 'Our First Education Drive Seed',
      slug: blog1Slug,
      excerpt: 'We successfully distributed 1000 books.',
      content: 'Long form content goes here...',
      status: 'PUBLISHED',
      published_at: new Date(),
      category_id: catStories.id,
      author_id: adminUser.id,
      featured_image_id: mockImage.id,
      blog_tags: {
        create: [ { tag_id: tagEdu.id } ]
      }
    }
  });

  // ==========================================
  // SEED NGO CONTENT
  // ==========================================
  console.log('🎯 Upserting Campaigns & Projects...');

  const campCatSlug = makeSlug('Relief Funds');
  const campCat = await prisma.campaignCategory.upsert({
    where: { slug: campCatSlug },
    update: {},
    create: { name: 'Relief Funds', slug: campCatSlug }
  });
  
  const campaignSlug = makeSlug('Winter Relief Fund 2026 Seed');
  const campaign = await prisma.campaign.upsert({
    where: { slug: campaignSlug },
    update: {},
    create: {
      title: 'Winter Relief Fund 2026 Seed',
      slug: campaignSlug,
      content: 'Help us provide blankets and warm clothes.',
      target_amount: 500000,
      raised_amount: 25000,
      status: 'ACTIVE',
      category_id: campCat.id,
      featured_image_id: mockImage.id
    }
  });

  const projectSlug = makeSlug('Rural Education Initiative Seed');
  const project = await prisma.project.upsert({
    where: { slug: projectSlug },
    update: {},
    create: {
      title: 'Rural Education Initiative Seed',
      slug: projectSlug,
      description: 'Building schools in rural areas.',
      status: 'PUBLISHED',
      featured_image_id: mockImage.id
    }
  });

  const activity = await prisma.activity.findFirst({ where: { title: 'Foundation Stone Laid Seed' } });
  if (!activity) {
    await prisma.activity.create({
      data: {
        project_id: project.id,
        title: 'Foundation Stone Laid Seed',
        description: 'Started the first building.',
        date: new Date()
      }
    });
  }

  // ==========================================
  // SEED DONORS & DONATIONS (Financial Safety)
  // ==========================================
  console.log('💰 Upserting Dev Fixture Donors & Donations...');

  const donorNumber1 = 'DNR-SEED-001';
  const donor1 = await prisma.donor.upsert({
    where: { donor_number: donorNumber1 },
    update: {},
    create: {
      first_name: 'Seed',
      last_name: 'Donor1',
      email: 'seeddonor1@example.com',
      phone: '+91 0000000001',
      pan_number: 'SEEDPAN123',
      donor_number: donorNumber1,
      status: 'ACTIVE'
    }
  });

  const donNum1 = 'DON-SEED-001';
  const donation1 = await prisma.donation.upsert({
    where: { donation_number: donNum1 },
    update: {},
    create: {
      donor_id: donor1.id,
      campaign_id: campaign.id,
      donation_number: donNum1,
      amount: 15000,
      status: 'SUCCESS',
      payment_type: 'ONLINE'
    }
  });

  const payId = 'pay_SeedRazorpay123';
  await prisma.payment.upsert({
    where: { provider_payment_id: payId },
    update: {},
    create: {
      donation_id: donation1.id,
      amount: 15000,
      provider: 'RAZORPAY',
      provider_payment_id: payId,
      provider_order_id: 'order_SeedRazorpay123',
      status: 'CAPTURED'
    }
  });

  const certNum = '80G-SEED-001';
  await prisma.certificate.upsert({
    where: { certificate_number: certNum },
    update: {},
    create: {
      donation_id: donation1.id,
      certificate_number: certNum,
      pdf_url: 'https://mock.url/seed_certificate.pdf',
      status: 'GENERATED',
      generated_at: new Date()
    }
  });

  console.log('✅ Safe, idempotent seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
