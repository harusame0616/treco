import { prisma } from '@/lib/prisma';

import { TrainingEvent } from '../models/training-event';
import { TrainingEventRepository } from '../usecases/repository';

export class TrainingEventPrismaRepository implements TrainingEventRepository {
  async findOneById(trainingEventId: string) {
    const trainingEvent = await prisma.trainingEvent.findUnique({
      where: {
        trainingEventId,
      },
    });

    return trainingEvent ? TrainingEvent.fromDto(trainingEvent) : null;
  }

  async findOneByOrder({
    trainingCategoryId,
  }: {
    order: 'last';
    trainingCategoryId: string;
  }) {
    const trainingEvent = await prisma.trainingEvent.findFirst({
      orderBy: {
        order: 'desc',
      },
      where: {
        trainingCategoryId,
      },
    });

    return trainingEvent ? TrainingEvent.fromDto(trainingEvent) : null;
  }

  async save(trainingEvent: TrainingEvent): Promise<void> {
    const dto = trainingEvent.toDto();

    await prisma.trainingEvent.upsert({
      create: dto,
      update: {
        loadUnit: dto.loadUnit,
        name: dto.name,
        valueUnit: dto.valueUnit,
      },
      where: {
        trainingEventId: dto.trainingEventId,
      },
    });
  }
}
