import { PrismaClient } from '@prisma/client';

import { authUserFixtures } from '../fixtures/auth-user.fixture';
import { traineeFixtures } from '../fixtures/trainee.fixture';
import { getDefaultCategories } from '../src/domains/training-category/lib/default-categories';
import { getDefaultEvents } from '../src/domains/training-event/lib/default-events';
import { generateId } from '../src/lib/id';

const prisma = new PrismaClient();

(async function main() {
  try {
    await prisma.$connect();

    await prisma.trainingSet.deleteMany();
    await prisma.trainingRecord.deleteMany();
    await prisma.trainingEvent.deleteMany();
    await prisma.trainingCategory.deleteMany();
    await prisma.trainee.deleteMany();
    await prisma.authUser.deleteMany();

    await prisma.authUser.createMany({
      data: authUserFixtures,
    });

    await prisma.trainee.createMany({
      data: authUserFixtures.map(({ authUserId }, index) => ({
        ...traineeFixtures[index],
        authUserId,
      })),
    });

    await Promise.all(
      traineeFixtures.map(async (trainee) =>
        getDefaultCategories().map(async (category, order) => {
          const trainingCategoryId = generateId();
          await prisma.trainingCategory.createMany({
            data: {
              ...category,
              order,
              traineeId: trainee.traineeId,
              trainingCategoryId,
            },
          });

          await prisma.trainingEvent.createMany({
            data: getDefaultEvents(category.name).map(
              ({ categoryName: _, ...event }, order) => ({
                ...event,
                order,
                traineeId: trainee.traineeId,
                trainingCategoryId,
                trainingEventId: generateId(),
              }),
            ),
          });
        }),
      ),
    );
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
