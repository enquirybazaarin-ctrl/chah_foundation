import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Restoring Our Endeavour metrics in database...');

  // 1. Delete any rogue cron metrics
  const deleted = await prisma.impactMetric.deleteMany({
    where: {
      metric_name: {
        in: ['Funds Raised', 'Active Donors']
      }
    }
  });
  console.log(`🧹 Removed ${deleted.count} rogue metric rows.`);

  // 2. Upsert the 4 core NGO endeavour metrics
  const endeavourMetrics = [
    { metric_name: 'Meals Served', metric_value: '2.5M+', icon: 'Utensils' },
    { metric_name: 'People Reached', metric_value: '10,000+', icon: 'Users' },
    { metric_name: 'Schools & Communities', metric_value: '172+', icon: 'School' },
    { metric_name: 'Healthcare Camps', metric_value: '350+', icon: 'Hospital' }
  ];

  for (const m of endeavourMetrics) {
    const existing = await prisma.impactMetric.findFirst({
      where: { metric_name: m.metric_name }
    });

    if (existing) {
      await prisma.impactMetric.update({
        where: { id: existing.id },
        data: m
      });
      console.log(`✅ Updated metric: ${m.metric_name}`);
    } else {
      await prisma.impactMetric.create({
        data: m
      });
      console.log(`✨ Created metric: ${m.metric_name}`);
    }
  }

  // 3. Ensure section settings are in place
  await prisma.setting.upsert({
    where: { setting_key: 'our_endeavour_section' },
    update: {
      setting_value: JSON.stringify({
        badge: 'OUR IMPACT',
        heading: 'Our Endeavour As NGO',
        description: 'At our core, we believe a food-secure society helps unlock its true potential. We are not only nourishing bodies but also opening doors to better education, health and prosperity for fellow citizens. Together, we can pave the way for a future where every vulnerable has an equal chance to thrive.',
        cta_text: 'Join Our Cause',
        cta_link: '/donate',
        updated_as_on: '04/10/2026'
      })
    },
    create: {
      setting_key: 'our_endeavour_section',
      setting_value: JSON.stringify({
        badge: 'OUR IMPACT',
        heading: 'Our Endeavour As NGO',
        description: 'At our core, we believe a food-secure society helps unlock its true potential. We are not only nourishing bodies but also opening doors to better education, health and prosperity for fellow citizens. Together, we can pave the way for a future where every vulnerable has an equal chance to thrive.',
        cta_text: 'Join Our Cause',
        cta_link: '/donate',
        updated_as_on: '04/10/2026'
      })
    }
  });

  console.log('🎉 Our Endeavour metrics successfully restored!');
}

main()
  .catch((e) => {
    console.error('❌ Error restoring metrics:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
