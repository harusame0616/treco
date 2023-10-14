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
  load: coerce(number(), Number),
  note: string([maxLength(255)]),
  traineeId: string(),
  trainingCategoryId: string([uuid()]),
  trainingEventId: string([uuid()]),
  trainingRecordId: string([uuid()]),
  value: coerce(number(), Number),
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
      load: formData.get('load'),
      value: formData.get('value'),
    });
  } catch (e: any) {
    console.error('validation error', {
      issue: JSON.stringify(e, null, 4),
      message: e.message,
      stack: e.stack,
    });
    throw new Error('validatin error');
  }

  const trainingRecord = await addSetUsecase.execute(input);

  revalidatePath(
    `/home/categories/${input.trainingCategoryId}/events/${input.trainingEventId}/records/${trainingRecord.trainingRecordId}`
  );
}
