import { TrainingRecordCreateUsecase } from '@/domains/training-record/usecases/create.usecase';
import dayjs from 'dayjs';
import { redirect } from 'next/navigation';
import { ValiError, object, parse, string, uuid } from 'valibot';

const inputSchema = object({
  trainingEventId: string([uuid()]),
  trainingCategoryId: string([uuid()]),
  trainingDate: string(),
  traineeId: string([uuid()]),
});

const createUsecase = new TrainingRecordCreateUsecase();

export async function createNewRecordAction(formData: FormData) {
  'use server';

  let input;
  try {
    input = parse(inputSchema, Object.fromEntries(formData.entries()));
  } catch (e) {
    if (e instanceof ValiError) {
      console.error(
        'validation error',
        JSON.stringify({
          func: 'createNewRecordAction',
          error: e,
        })
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
    trainingDate: new Date(input.trainingDate),
  });

  redirect(
    `/home/categories/${input.trainingCategoryId}/events/${
      input.trainingEventId
    }/records/${newRecord.trainingRecordId}?date=${dayjs(
      newRecord.trainingDate
    ).toISOString()}`
  );
}
