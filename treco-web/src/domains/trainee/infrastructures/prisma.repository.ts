import { prisma } from '@/lib/prisma';

import { Trainee } from '../models/trainee';
import { TraineeRepository } from '../usecases/repository';

export class TraineePrismaRepository extends TraineeRepository {
  async findOneById(traineeId: string) {
    const trainee = await prisma.trainee.findUnique({
      where: {
        traineeId,
      },
    });

    return trainee ? Trainee.fromDto(trainee) : null;
  }

  protected async saveImpl(trainee: Trainee): Promise<void> {
    const dto = trainee.toDto();

    await prisma.trainee.upsert({
      create: {
        ...dto,
      },
      update: {
        name: dto.name,
      },
      where: {
        traineeId: dto.traineeId,
      },
    });
  }
}
