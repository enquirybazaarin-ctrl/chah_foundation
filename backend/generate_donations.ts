import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Generating dummy donations...');
  const donors = await prisma.donor.findMany({ take: 50 });
  
  if (donors.length === 0) {
    console.log("No donors found to attach donations to.");
    return;
  }

  let count = 0;
  for (const donor of donors) {
    const amount = [500, 1000, 1500, 2000, 5000, 10000][Math.floor(Math.random() * 6)];
    await prisma.donation.create({
      data: {
        donation_number: `DON-${Date.now()}-${count}`,
        donor_id: donor.id,
        amount: amount,
        payment_type: 'ONLINE',
        status: 'SUCCESS',
      }
    });
    count++;
  }
  console.log(`${count} dummy donations created successfully!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
