import { prisma } from '@/lib/prisma';
import { Trainee } from '../models/trainee';
import { TraineeRepository } from '../usecases/repository';

export class TraineePrismaRepository implements TraineeRepository {
  async findOneById(traineeId: string) {
    const trainee = await prisma.trainee.findUnique({
      where: {
        traineeId,
      },
    });

    return trainee ? Trainee.fromDto(trainee) : null;
  }
}
