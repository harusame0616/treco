import { prisma } from '@/lib/prisma';

import { TrainingCategory } from '../models/training-category';
import { TrainingCategoryRepository } from '../usecases/repository';

export class TrainingCategoryPrismaRepository
  implements TrainingCategoryRepository
{
  async delete(trainingCategoryId: string): Promise<void> {
    await prisma.trainingCategory.delete({
      where: {
        trainingCategoryId,
      },
    });
  }

  async findById(trainingCategoryId: string): Promise<TrainingCategory> {
    const trainingCategory = await prisma.trainingCategory.findUnique({
      where: { trainingCategoryId },
    });

    if (!trainingCategory) {
      throw new Error('トレーニングカテゴリーが見つかりませんでした');
    }

    return TrainingCategory.fromDto(trainingCategory);
  }

  async findOneByOrder({ traineeId }: { order: 'last'; traineeId: string }) {
    const trainingCategory = await prisma.trainingCategory.findFirst({
      orderBy: { order: 'desc' },
      where: { traineeId },
    });

    if (!trainingCategory) {
      return null;
    }

    return TrainingCategory.fromDto(trainingCategory);
  }

  async save(trainingCategory: TrainingCategory): Promise<void> {
    const dto = trainingCategory.toDto();
    await prisma.trainingCategory.upsert({
      create: dto,
      update: {
        color: dto.color,
        name: dto.name,
        order: dto.order,
      },
      where: { trainingCategoryId: dto.trainingCategoryId },
    });
  }
}
