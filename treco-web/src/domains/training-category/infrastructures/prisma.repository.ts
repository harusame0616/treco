import { prisma } from '@/lib/prisma';
import { TrainingCategory } from '../models/training-category';
import { TrainingCategoryRepository } from '../usecases/repository';

export class TrainingCategoryPrismaRepository
  implements TrainingCategoryRepository
{
  async findById(trainingCategoryId: string): Promise<TrainingCategory> {
    const trainingCategory = await prisma.trainingCategory.findUnique({
      where: { trainingCategoryId },
    });

    if (!trainingCategory) {
      throw new Error('トレーニングカテゴリーが見つかりませんでした');
    }

    return TrainingCategory.fromDto(trainingCategory);
  }

  async save(trainingCategory: TrainingCategory): Promise<void> {
    const dto = trainingCategory.toDto();
    await prisma.trainingCategory.update({
      where: { trainingCategoryId: dto.trainingCategoryId },
      data: {
        name: dto.name,
        color: dto.color,
        order: dto.order,
      },
    });
  }
}
