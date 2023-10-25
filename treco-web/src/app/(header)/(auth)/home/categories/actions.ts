'use server';

import { TrainingCategoryPrismaRepository } from '@/domains/training-category/infrastructures/prisma.repository';
import { TrainingCategoryEditUsecase } from '@/domains/training-category/usecases/edit.usecase';
import { revalidatePath } from 'next/cache';

type EditCategoryProps = {
  trainingCategoryId: string;
  name: string;
  color: string;
};

export async function editCategoryAction(props: EditCategoryProps) {
  await new TrainingCategoryEditUsecase(
    new TrainingCategoryPrismaRepository(),
  ).execute(props);

  revalidatePath('(header)/(auth)/home/categories');
}
