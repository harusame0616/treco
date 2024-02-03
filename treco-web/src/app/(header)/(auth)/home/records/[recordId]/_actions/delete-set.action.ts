'use server';

import { PrismaTrainingRecordRepository } from '@/domains/training-record/infrastructures/prisma.repository';
import { TrainingRecordDeleteSetUsecase } from '@/domains/training-record/usecases/delete-set.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const deleteSetUsecase = new TrainingRecordDeleteSetUsecase(
  new PrismaTrainingRecordRepository(),
);

type Props = {
  trainingRecordId: string;
  trainingSetIndex: number;
};

export async function deleteSetAction({
  trainingRecordId,
  trainingSetIndex,
}: Props) {
  const traineeId = await getSignedInTraineeId();
  await deleteSetUsecase.execute({
    traineeId,
    trainingRecordId,
    trainingSetIndex,
  });

  revalidatePath(`/home/records/${trainingRecordId}`);
}
