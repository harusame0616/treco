import { prisma } from '@/lib/prisma';

import { TrainingRecord } from '../models/training-record';
import { TrainingRecordRepository } from '../usecases/training-record.repository';

export class PrismaTrainingRecordRepository
  implements TrainingRecordRepository
{
  async delete(trainingRecordId: string): Promise<void> {
    await prisma.trainingRecord.delete({
      where: {
        trainingRecordId,
      },
    });
  }

  async findOneById(trainingRecordId: string): Promise<TrainingRecord> {
    const trainingRecord = await prisma.trainingRecord.findUnique({
      include: {
        sets: true,
      },
      where: {
        trainingRecordId,
      },
    });

    if (trainingRecord === null) {
      throw new Error();
    }

    return TrainingRecord.fromDto(trainingRecord);
  }

  async save(trainingRecord: TrainingRecord): Promise<void> {
    const { sets, traineeId, trainingDate, trainingEventId, trainingRecordId } =
      trainingRecord.toDto();

    await prisma.trainingSet.deleteMany({
      where: {
        trainingRecordId,
      },
    });

    await prisma.trainingRecord.upsert({
      create: {
        sets: {
          createMany: {
            data: sets.map(({ load, note, value }, order) => ({
              load,
              note,
              order,
              value,
            })),
          },
        },
        traineeId,
        trainingDate,
        trainingEventId,
        trainingRecordId,
      },
      update: {
        sets: {
          createMany: {
            data: sets.map(({ load, note, value }, order) => ({
              load,
              note,
              order,
              value,
            })),
          },
        },
        trainingDate,
      },
      where: {
        trainingRecordId,
      },
    });
  }
}
