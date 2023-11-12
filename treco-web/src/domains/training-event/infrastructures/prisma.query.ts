import { prisma } from '@/lib/prisma';

import { TrainingEventDto } from '../models/training-event';
import { TrainingEventQuery } from '../usecases/training-event.query';

export class PrismaTrainingEventQuery implements TrainingEventQuery {
  queryListByTrainingCategoryId(
    trainingCategoryId: string,
  ): Promise<TrainingEventDto[]> {
    return prisma.trainingEvent.findMany({
      orderBy: {
        order: 'asc',
      },
      where: {
        trainingCategoryId,
      },
    });
  }
}
