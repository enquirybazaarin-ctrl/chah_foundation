import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@chahfoundation.org';
  const password = 'Password123!';
  const password_hash = await bcrypt.hash(password, 12);

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { password_hash },
  });

  console.log(`Password for ${email} reset to: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
