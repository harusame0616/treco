'use server';

import { TrainingCategoryPrismaRepository } from '@/domains/training-category/infrastructures/prisma.repository';
import { TrainingCategoryDeleteUsecase } from '@/domains/training-category/usecases/delete.usecase';
import { revalidatePath } from 'next/cache';

type Props = {
  trainingCategoryId: string;
};

export async function deleteTrainingCategoryAction(props: Props) {
  await new TrainingCategoryDeleteUsecase(
    new TrainingCategoryPrismaRepository(),
  ).execute(props);

  revalidatePath('(header)/(auth)/home/categories');
}