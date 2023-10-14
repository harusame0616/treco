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
    const { trainingRecordId, trainingDate, traineeId, trainingEventId, sets } =
      trainingRecord.toDto();
    await prisma.trainingRecord.upsert({
      where: {
        trainingRecordId,
      },
      create: {
        trainingRecordId,
        trainingDate,
        traineeId,
        trainingEventId,
        sets: {
          createMany: {
            data: sets.map(({ load, note, value }, order) => ({
              load,
              note,
              value,
              order,
            })),
          },
        },
      },
      update: {
        trainingDate,
        sets: {
          upsert: sets.map(({ value, load, note }, order) => ({
            where: {
              trainingRecordId_order: {
                trainingRecordId,
                order,
              },
            },
            create: {
              value,
              load,
              note,
              order,
            },
            update: {
              value,
              load,
              note,
              order,
            },
          })),
        },
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
