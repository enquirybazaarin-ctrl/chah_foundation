import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Generating Requires Attention data...');

  // 1. Unread Enquiries
  await prisma.contactEnquiry.createMany({
    data: [
      { name: 'John Doe', email: 'john@example.com', message: 'I want to partner with you.', status: 'UNREAD' },
      { name: 'Jane Smith', email: 'jane@example.com', message: 'How do I cancel my subscription?', status: 'UNREAD' },
      { name: 'NGO Corp', email: 'hello@ngocorp.org', message: 'CSR funding opportunity', status: 'UNREAD' }
    ]
  });

  // 2. Failed Payments (this month)
  // Need a donation to link payments to
  const donation = await prisma.donation.findFirst();
  if (donation) {
    const today = new Date();
    await prisma.payment.createMany({
      data: [
        { 
          provider_payment_id: 'pay_failed1', 
          amount: 5000, 
          provider: 'RAZORPAY', 
          method: 'UPI', 
          status: 'FAILED', 
          donation_id: donation.id, 
          created_at: today 
        },
        { 
          provider_payment_id: 'pay_failed2', 
          amount: 1500, 
          provider: 'RAZORPAY', 
          method: 'CARD', 
          status: 'FAILED', 
          donation_id: donation.id, 
          created_at: today 
        }
      ]
    });
  }

  // 3. Failed Certificate
  // Must use a unique donation without a certificate already
  const donationNoCert = await prisma.donation.findFirst({ 
    where: { 
      status: 'SUCCESS', 
      certificate: null 
    }
  });
  if (donationNoCert) {
    await prisma.certificate.create({
      data: {
        certificate_number: 'CERT-FAILED-1',
        donation_id: donationNoCert.id,
        status: 'FAILED'
      }
    });
  }
  
  console.log('Data generated successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
