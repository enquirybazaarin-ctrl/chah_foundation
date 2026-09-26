import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Generating dummy campaigns...');
  const category = await prisma.campaignCategory.findFirst();
  if (!category) {
      console.log('No category found!');
      return;
  }

  const campaigns = [
    { title: 'Education for All', slug: 'education-for-all-' + Date.now(), status: 'ACTIVE' },
    { title: 'Clean Water Initiative', slug: 'clean-water-init-' + Date.now(), status: 'ACTIVE' },
    { title: 'Healthcare Support Fund', slug: 'healthcare-support-' + Date.now(), status: 'COMPLETED' },
    { title: 'Women Empowerment 2026', slug: 'women-empowerment-' + Date.now(), status: 'ACTIVE' },
  ];

  for (const c of campaigns) {
    await prisma.campaign.create({
      data: {
        category_id: category.id,
        title: c.title,
        slug: c.slug,
        target_amount: 100000,
        raised_amount: 5000,
        status: c.status as any,
        start_date: new Date(),
        content: 'Dummy content'
      }
    });
  }

  // Update existing donations to use these new campaigns
  const dbCampaigns = await prisma.campaign.findMany();
  const donations = await prisma.donation.findMany({ where: { donation_number: { startsWith: 'DON-' } } });

  for (const d of donations) {
      const randomCampaign = dbCampaigns[Math.floor(Math.random() * dbCampaigns.length)];
      await prisma.donation.update({ where: { id: d.id }, data: { campaign_id: randomCampaign.id } });
  }

  console.log('Dummy campaigns created and donations updated!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
