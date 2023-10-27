'use server';

import { TraineePrismaRepository } from '@/domains/trainee/infrastructures/prisma.repository';
import { TrainingEventPrismaRepository } from '@/domains/training-event/infrastructures/prisma.repository';
import { TrainingEventCreateUsecase } from '@/domains/training-event/usecases/create.usecase';
import { PrismaTrainingRecordRepository } from '@/domains/training-record/infrastructures/prisma.repository';
import { TrainingRecordCreateUsecase } from '@/domains/training-record/usecases/create.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import dayjs from 'dayjs';
import { revalidatePath } from 'next/cache';
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
    trainingDate: new Date(input.trainingDate),
  });

  redirect(
    `/home/categories/${input.trainingCategoryId}/events/${
      input.trainingEventId
    }/records/${newRecord.trainingRecordId}?date=${dayjs(
      newRecord.trainingDate,
    ).toISOString()}`,
  );
}

type CreateTrainingEventProps = {
  trainingCategoryId: string;
  name: string;
  valueUnit: string;
  loadUnit: string;
};

export async function createTrainingEventAction(
  props: CreateTrainingEventProps,
) {
  const traineeId = await getSignedInTraineeId();

  await new TrainingEventCreateUsecase(
    new TraineePrismaRepository(),
    new TrainingEventPrismaRepository(),
  ).execute({
    traineeId,
    ...props,
  });

  revalidatePath(`/home/categories/${props.trainingCategoryId}`, 'page');
}
