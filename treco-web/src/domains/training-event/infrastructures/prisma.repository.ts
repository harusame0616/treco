import { prisma } from '@/lib/prisma';
import { TrainingEventRepository } from '../usecases/repository';
import { TrainingEvent } from '../models/training-event';

export class TrainingEventPrismaRepository implements TrainingEventRepository {
  async save(trainingEvent: TrainingEvent): Promise<void> {
    const dto = trainingEvent.toDto();

    await prisma.trainingEvent.create({
      data: dto,
    });
  }

  async findOneByOrder({
    trainingCategoryId,
  }: {
    trainingCategoryId: string;
    order: 'last';
  }) {
    const trainingEvent = await prisma.trainingEvent.findFirst({
      where: {
        trainingCategoryId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    return trainingEvent ? TrainingEvent.fromDto(trainingEvent) : null;
  }

  async findOneById(trainingEventId: string) {
    const trainingEvent = await prisma.trainingEvent.findUnique({
      where: {
        trainingEventId,
      },
    });

    return trainingEvent ? TrainingEvent.fromDto(trainingEvent) : null;
  }
}
