import { PrismaClient } from '@prisma/client';

import { authUserFixtures } from '../fixtures/auth-user.fixture';
import { traineeFixtures } from '../fixtures/trainee.fixture';

const prisma = new PrismaClient();

async function main() {}
main()
  .then(async () => {
    await prisma.trainingSet.deleteMany();
    await prisma.trainingRecord.deleteMany();
    await prisma.trainingEvent.deleteMany();
    await prisma.trainingCategory.deleteMany();
    await prisma.authUser.deleteMany();
    await prisma.trainee.deleteMany();

    await prisma.trainee.createMany({
      data: traineeFixtures,
    });

    await prisma.authUser.createMany({
      data: traineeFixtures.map((trainee, index) => {
        return {
          traineeId: trainee.traineeId,
          ...authUserFixtures[index],
        };
      }),
    }),
      await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
