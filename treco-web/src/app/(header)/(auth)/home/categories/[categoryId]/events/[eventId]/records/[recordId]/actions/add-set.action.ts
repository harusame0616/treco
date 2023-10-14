import { PrismaTrainingRecordRepository } from '@/domains/training-record/infrastructures/prisma.repository';
import { TrainingRecordAddSetUsecase } from '@/domains/training-record/usecases/add-set.usecase';
import { revalidatePath } from 'next/cache';
import {
  coerce,
  maxLength,
  number,
  object,
  parse,
  string,
  uuid,
} from 'valibot';

const inputSchema = object({
  trainingRecordId: string([uuid()]),
  traineeId: string(),
  trainingCategoryId: string([uuid()]),
  trainingEventId: string([uuid()]),
  value: coerce(number(), Number),
  load: coerce(number(), Number),
  note: string([maxLength(255)]),
});

const addSetUsecase = new TrainingRecordAddSetUsecase(
  new PrismaTrainingRecordRepository()
);

export async function addSetAction(formData: FormData) {
  'use server';

  let input;
  try {
    input = parse(inputSchema, {
      ...Object.fromEntries(formData.entries()),
      value: formData.get('value'),
      load: formData.get('load'),
    });
  } catch (e: any) {
    console.error('validation error', {
      message: e.message,
      stack: e.stack,
      issue: JSON.stringify(e, null, 4),
    });
    throw new Error('validatin error');
  }

  const trainingRecord = await addSetUsecase.execute(input);

  revalidatePath(
    `/home/categories/${input.trainingCategoryId}/events/${input.trainingEventId}/records/${trainingRecord.trainingRecordId}`
  );
}
