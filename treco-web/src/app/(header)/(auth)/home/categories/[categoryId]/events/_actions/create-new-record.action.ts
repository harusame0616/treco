'use server';

import { PrismaTrainingRecordRepository } from '@/domains/training-record/infrastructures/prisma.repository';
import { TrainingRecordCreateUsecase } from '@/domains/training-record/usecases/create.usecase';
import { createTZDate } from '@/lib/date';
import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import { ValiError, object, parse, string, uuid } from 'valibot';

const inputSchema = object({
  traineeId: string([uuid()]),
  trainingCategoryId: string([uuid()]),
  trainingDate: string(),
  trainingEventId: string([uuid()]),
});

const createUsecase = new TrainingRecordCreateUsecase(
  new PrismaTrainingRecordRepository(),
);

export async function createNewRecordAction(formData: FormData) {
  let input;
  try {
    input = parse(inputSchema, Object.fromEntries(formData.entries()));
  } catch (e) {
    if (e instanceof ValiError) {
      console.error(
        'validation error',
        JSON.stringify({
          error: e,
          func: 'createNewRecordAction',
        }),
      );
      throw new Error('validation error');
    }
    console.error('unknown error', {
      func: 'createNewRecordAction',
    });
    throw new Error('unknown error');
  }

  const newRecord = await createUsecase.execute({
    ...input,
    trainingDate: createTZDate(input.trainingDate).toDate(),
  });

  redirect(
    `/home/categories/${input.trainingCategoryId}/events/${
      input.trainingEventId
    }/records/${newRecord.trainingRecordId}?date=${dayjs(
      newRecord.trainingDate,
    ).format('YYYY-MM-DD')}`,
  );
}
