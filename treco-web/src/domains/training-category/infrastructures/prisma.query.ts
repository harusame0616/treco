import { prisma } from '@/lib/prisma';

import { TrainingCategoryDto } from '../models/training-category';
import { TrainingCategoryQuery } from '../usecases/training-category.query';

export class PrismaTrainingCategoryQuery implements TrainingCategoryQuery {
  queryListByTraineeId(traineeId: string): Promise<TrainingCategoryDto[]> {
    return prisma.trainingCategory.findMany({
      where: {
        traineeId,
      },
    });
  }
}
