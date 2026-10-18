import { prisma } from '../src/config/database';

async function cleanDummyCampaigns() {
  console.log('--- Cleaning dummy campaigns from database ---');
  
  const dummySlugs = [
    'urgent-heart-surgery-baby-ananya',
    'help-dhrupad-leukaemia',
    'help-baby-reyansh-spinal-treatment',
    'urgent-kidney-transplant-ramesh',
    'help-amit-continue-education',
    'help-veena-school-kit',
    'help-bharti-continue-school',
    'clean-water-sanitation-aarav',
    'urgent-heart-surgery-rohan',
    'support-priyas-leukemia',
    'help-ankit-recover',
    'support-sunita-operation'
  ];

  const deleted = await prisma.campaign.deleteMany({
    where: {
      OR: [
        { slug: { in: dummySlugs } },
        { title: { contains: 'Baby Ananya' } },
        { title: { contains: 'Dhrupad' } },
        { title: { contains: 'Baby Reyansh' } },
        { title: { contains: 'Amit continue his education' } },
        { title: { contains: 'Veena get her school kit' } },
        { title: { contains: 'Veena get a complete school kit' } },
        { title: { contains: 'Bharti continue school' } },
        { title: { contains: 'Aarav and schoolmates' } },
        { title: { contains: 'Rohan' } },
        { title: { contains: 'Priya' } },
      ]
    }
  });

  console.log(`✅ Removed ${deleted.count} dummy campaigns from database.`);
}

cleanDummyCampaigns()
  .catch((e) => {
    console.error('Error cleaning dummy campaigns:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
