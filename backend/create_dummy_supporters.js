const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find the campaign
  const campaign = await prisma.campaign.findFirst({
    where: { slug: 'help-dhrupad-leukaemia' }
  });

  if (!campaign) {
    console.error("Campaign 'help-dhrupad-leukaemia' not found!");
    process.exit(1);
  }

  console.log(`Found campaign: ${campaign.title} (ID: ${campaign.id})`);

  // Create a few donors and donations
  const dummySupporters = [
    { firstName: "Amit", amount: 5000, isAnonymous: false },
    { firstName: "Rahul", amount: 2500, isAnonymous: false },
    { firstName: "Priya", amount: 1100, isAnonymous: true },
    { firstName: "Neha", amount: 501, isAnonymous: false },
    { firstName: "Vikram", amount: 10000, isAnonymous: true }
  ];

  for (let i = 0; i < dummySupporters.length; i++) {
    const supporter = dummySupporters[i];
    
    // Create donor
    const donor = await prisma.donor.create({
      data: {
        donor_number: `DONOR-DUMMY-${Date.now()}-${i}`,
        first_name: supporter.firstName,
        email: `dummy${Date.now()}${i}@example.com`,
      }
    });

    // Create donation
    await prisma.donation.create({
      data: {
        donation_number: `DON-${Date.now()}-${i}`,
        donor_id: donor.id,
        campaign_id: campaign.id,
        amount: supporter.amount,
        payment_type: "ONLINE",
        status: "SUCCESS",
        is_anonymous: supporter.isAnonymous,
      }
    });

    console.log(`Created donation of Rs ${supporter.amount} by ${supporter.firstName} (Anonymous: ${supporter.isAnonymous})`);
  }

  // Update campaign supporters count
  await prisma.campaign.update({
    where: { id: campaign.id },
    data: {
      supporters_count: (campaign.supporters_count || 0) + dummySupporters.length
    }
  });

  console.log("Successfully added dummy supporters!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
