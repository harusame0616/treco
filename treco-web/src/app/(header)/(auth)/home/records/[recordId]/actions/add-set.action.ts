'use server';

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
  trainingRecordId: string([uuid()]),
  value: coerce(number(), Number),
});

const addSetUsecase = new TrainingRecordAddSetUsecase(
  new PrismaTrainingRecordRepository(),
);

export async function addSetAction(formData: FormData) {
  let input;
  try {
    input = parse(inputSchema, {
      ...Object.fromEntries(formData.entries()),
      load: formData.get('load'),
      value: formData.get('value'),
    });
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('validation error', {
      issue: JSON.stringify(e, null, 4),
      message: e.message,
      stack: e.stack,
    });
    throw new Error('validatin error');
  }

  const trainingRecord = await addSetUsecase.execute(input);

  revalidatePath(`/home/records/${trainingRecord.trainingRecordId}`);
}