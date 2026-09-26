import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateRandomPAN() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  let pan = '';
  for (let i = 0; i < 5; i++) pan += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 4; i++) pan += nums.charAt(Math.floor(Math.random() * nums.length));
  pan += chars.charAt(Math.floor(Math.random() * chars.length));
  return pan;
}

async function main() {
  console.log('Generating dummy PANs...');
  const donors = await prisma.donor.findMany();
  let count = 0;
  for (const d of donors) {
    if (!d.pan_number) {
        if (Math.random() > 0.3) {
            await prisma.donor.update({ where: { id: d.id }, data: { pan_number: generateRandomPAN() }});
            count++;
        }
    }
  }
  console.log(`Generated PANs for ${count} donors!`);
}
main().catch(console.error).finally(()=>prisma.$disconnect());
