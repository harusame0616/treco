import { TrainingRecordCreateUsecase } from '@/domains/training-record/usecases/create.usecase';
import { redirect } from 'next/navigation';
import { object, parse, string, uuid } from 'valibot';

const inputSchema = object({
  trainingEventId: string([uuid()]),
  trainingCategoryId: string([uuid()]),
  traineeId: string([uuid()]),
});

const createUsecase = new TrainingRecordCreateUsecase();

export async function createNewRecordAction(formData: FormData) {
  'use server';

  let input;
  try {
    input = parse(inputSchema, Object.fromEntries(formData.entries()));
  } catch (e) {
    throw new Error('validatin error');
  }

  const newRecord = await createUsecase.execute(input);

  redirect(
    `/home/categories/${input.trainingCategoryId}/events/${input.trainingEventId}/records/${newRecord.trainingRecordId}`
  );
}
