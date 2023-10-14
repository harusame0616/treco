import { PrismaTrainingRecordRepository } from '@/domains/training-record/infrastructures/prisma.repository';
import { TrainingRecordAddSetUsecase } from '@/domains/training-record/usecases/add-set.usecase';
import { TrainingRecordEditSetUsecase } from '@/domains/training-record/usecases/edit-set.usecase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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
  index: coerce(number(), Number),
});

const editSetUsecase = new TrainingRecordEditSetUsecase(
  new PrismaTrainingRecordRepository()
);

export async function editSetAction(formData: FormData) {
  'use server';

  let input;
  try {
    input = parse(inputSchema, {
      ...Object.fromEntries(formData.entries()),
      value: formData.get('value') || undefined,
      load: formData.get('load') || undefined,
      index: formData.get('index') || undefined,
    });
  } catch (e: any) {
    console.error('validation error', {
      message: e.message,
      stack: e.stack,
      issue: JSON.stringify(e, null, 4),
    });
    throw new Error('validation error');
  }

  const trainingRecord = await editSetUsecase.execute(input);

  revalidatePath(
    `/home/categories/${input.trainingCategoryId}/events/${input.trainingEventId}/records/${trainingRecord.trainingRecordId}`
  );
  redirect(
    `/home/categories/${input.trainingCategoryId}/events/${input.trainingEventId}/records/${trainingRecord.trainingRecordId}`
  );
}
