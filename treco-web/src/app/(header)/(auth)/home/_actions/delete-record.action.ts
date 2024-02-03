'use server';

import { PrismaTrainingRecordRepository } from '@/domains/training-record/infrastructures/prisma.repository';
import { TrainingRecordDeleteUsecase } from '@/domains/training-record/usecases/delete.usecase.ts';
import { revalidatePath } from 'next/cache';

const trainingRecordDeleteUsecase = new TrainingRecordDeleteUsecase(
  new PrismaTrainingRecordRepository(),
);

export async function deleteRecordAction(trainingRecordId: string) {
  await trainingRecordDeleteUsecase.execute({ trainingRecordId });
  revalidatePath('/home');
}
