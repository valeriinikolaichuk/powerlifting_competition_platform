import { PrismaClient, UserRole, UserStatus, } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('squater', 10);
  const userPassword = await bcrypt.hash('user', 10);
  const participantPassword = await bcrypt.hash('part', 10);

  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        password: adminPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
      {
        username: 'user',
        password: userPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      },
            {
        username: 'part',
        password: participantPassword,
        role: UserRole.PARTICIPANT,
        status: UserStatus.ACTIVE,
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