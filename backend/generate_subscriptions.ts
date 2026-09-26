import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Generating dummy subscriptions...');
  const donors = await prisma.donor.findMany({ take: 30 }); // We'll just take the first 30 donors
  const campaigns = await prisma.campaign.findMany();
  
  if (donors.length === 0) {
    console.log("No donors found to attach subscriptions to.");
    return;
  }

  const frequencies = ['MONTHLY', 'QUARTERLY', 'YEARLY'];
  const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'PAUSED', 'CANCELLED']; // Weighted towards ACTIVE

  let count = 0;
  for (const donor of donors) {
    const amount = [500, 1000, 2000][Math.floor(Math.random() * 3)];
    const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const campaignId = campaigns.length > 0 ? campaigns[Math.floor(Math.random() * campaigns.length)].id : undefined;

    const nextBilling = new Date();
    if (freq === 'MONTHLY') nextBilling.setMonth(nextBilling.getMonth() + 1);
    if (freq === 'QUARTERLY') nextBilling.setMonth(nextBilling.getMonth() + 3);
    if (freq === 'YEARLY') nextBilling.setFullYear(nextBilling.getFullYear() + 1);

    await prisma.subscription.create({
      data: {
        subscription_number: `SUB-${Date.now()}-${count}`,
        donor_id: donor.id,
        campaign_id: campaignId,
        amount: amount,
        frequency: freq as any,
        status: status as any,
        next_billing_date: status === 'ACTIVE' ? nextBilling : null,
        razorpay_subscription_id: `sub_${Date.now()}_${count}`,
      }
    });
    count++;
  }
  console.log(`${count} dummy subscriptions created successfully!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
