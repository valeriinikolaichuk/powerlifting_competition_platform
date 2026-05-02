import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('squater', 10);
  const userPassword = await bcrypt.hash('user', 10);

  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        password: adminPassword,
        status: 'admin',
      },
      {
        username: 'user',
        password: userPassword,
        status: 'user',
      },
    ],
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });