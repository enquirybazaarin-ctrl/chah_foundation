import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating dummy donations with campaigns and certificates...');
  const donations = await prisma.donation.findMany({
    where: { donation_number: { startsWith: 'DON-' } },
    include: { payments: true, certificate: true }
  });
  
  const campaigns = await prisma.campaign.findMany();
  if (campaigns.length === 0) {
    console.log("No campaigns found.");
    return;
  }

  const paymentTypes = ['ONLINE', 'CASH', 'CHEQUE', 'BANK_TRANSFER'];
  const methods = ['upi', 'card', 'netbanking', null];

  let count = 0;
  for (const donation of donations) {
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const pt = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
    
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        campaign_id: campaign.id,
        payment_type: pt as any,
      }
    });

    if (donation.payments.length === 0 && pt === 'ONLINE') {
        await prisma.payment.create({
            data: {
                donation_id: donation.id,
                amount: donation.amount,
                provider: 'RAZORPAY',
                provider_payment_id: `pay_${Date.now()}_${count}`,
                status: 'CAPTURED',
                method: methods[Math.floor(Math.random() * 3)]
            }
        });
    }

    if (!donation.certificate) {
        await prisma.certificate.create({
            data: {
                donation_id: donation.id,
                certificate_number: `80G-${new Date().getFullYear()}-${donation.donation_number.split('-').pop()}`,
                status: 'GENERATED',
                pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                generated_at: new Date()
            }
        });
    }

    count++;
  }
  console.log(`${count} dummy donations updated with realistic data!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
