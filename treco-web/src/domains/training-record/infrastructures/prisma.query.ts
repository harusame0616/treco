import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

import { TrainingRecordQuery } from '../usecases/training-record.query';

export class PrismaTrainingRecordQuery implements TrainingRecordQuery {
  async queryOneForRecordEdit(trainingRecordId: string) {
    const trainingRecord = await prisma.trainingRecord.findUnique({
      include: {
        sets: true,
        trainingEvent: {
          include: {
            trainingCategory: true,
          },
        },
      },
      where: {
        trainingRecordId,
      },
    });

    if (!trainingRecord) {
      throw new Error('TrainingRecord not found');
    }

    return {
      ...trainingRecord,
      trainingCategory: trainingRecord.trainingEvent.trainingCategory,
    };
  }

  async queryTrainingMarksForCalendar({
    end,
    start,
    traineeId,
  }: {
    end: Date;
    start: Date;
    traineeId: string;
  }) {
    const records = await prisma.trainingRecord.findMany({
      include: {
        trainingEvent: {
          include: {
            trainingCategory: true,
          },
        },
      },
      where: {
        traineeId,
        trainingDate: {
          gte: start.toISOString(),
          lt: end.toISOString(),
        },
      },
    });

    return records.map((record) => ({
      color: record.trainingEvent.trainingCategory.color,
      trainingCategoryId: record.trainingEvent.trainingCategoryId,
      trainingDate: record.trainingDate,
      trainingRecordId: record.trainingRecordId,
    }));
  }

  async queryTrainingRecordForHome(traineeId: string, trainingDate: Date) {
    const records = await prisma.trainingRecord.findMany({
      include: {
        sets: true,
        trainingEvent: {
          include: {
            trainingCategory: true,
          },
        },
      },
      where: {
        traineeId,
        trainingDate: {
          gte: trainingDate,
          lt: dayjs(trainingDate).add(1, 'day').toDate(),
        },
      },
    });

    return records.map((record) => ({
      ...record,
      trainingCategory: record.trainingEvent.trainingCategory,
    }));
  }
}
