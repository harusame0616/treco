import { prisma } from '@/lib/prisma';

import { TrainingRecord } from '../models/training-record';
import { TrainingRecordRepository } from '../usecases/training-record.repository';

export class PrismaTrainingRecordRepository
  implements TrainingRecordRepository
{
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
          upsert: sets.map(({ load, note, value }, order) => ({
            create: {
              load,
              note,
              order,
              value,
            },
            update: {
              load,
              note,
              order,
              value,
            },
            where: {
              trainingRecordId_order: {
                order,
                trainingRecordId,
              },
            },
          })),
        },
        trainingDate,
      },
      where: {
        trainingRecordId,
      },
      // create: {
      //   ...dto,
      //   sets: {
      //     createMany: {
      //       data: dto.sets.map((set, order) => ({
      //         trainingRecordId: dto.trainingRecordId,
      //         order,
      //         ...set,
      //       })),
      //     },
      //   },
      // },
    });
  }
}
