import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Generating dummy reconciliation jobs...');
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user found.');
    return;
  }

  const jobs = [
    {
      filename: 'HDFC_Statement_Sep2026.csv',
      total_records: 154,
      matched_records: 12,
      status: 'COMPLETED',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      filename: 'SBI_Statement_August2026.csv',
      total_records: 432,
      matched_records: 31,
      status: 'COMPLETED',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      filename: 'ICICI_Statement_Sep2026_Failed.csv',
      total_records: 0,
      matched_records: 0,
      status: 'FAILED',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      filename: 'Axis_Statement_Sep26_Final.csv',
      total_records: 200,
      matched_records: 18,
      status: 'COMPLETED',
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000)
    }
  ];

  let count = 0;
  for (const job of jobs) {
    await prisma.bankReconciliationJob.create({
      data: {
        filename: job.filename,
        total_records: job.total_records,
        matched_records: job.matched_records,
        status: job.status,
        uploaded_by: user.id,
        created_at: job.created_at
      }
    });
    count++;
  }

  console.log(`Generated ${count} reconciliation jobs!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
