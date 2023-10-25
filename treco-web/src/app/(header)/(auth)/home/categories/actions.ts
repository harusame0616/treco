'use server';

import { TraineePrismaRepository } from '@/domains/trainee/infrastructures/prisma.repository';
import { TrainingCategoryPrismaRepository } from '@/domains/training-category/infrastructures/prisma.repository';
import { TrainingCategoryCreateUsecase } from '@/domains/training-category/usecases/create.usecase';
import { TrainingCategoryEditUsecase } from '@/domains/training-category/usecases/edit.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
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

type CreateCategoryProps = {
  name: string;
  color: string;
};

export async function createCategoryAction(props: CreateCategoryProps) {
  const traineeId = await getSignedInTraineeId();

  await new TrainingCategoryCreateUsecase(
    new TraineePrismaRepository(),
    new TrainingCategoryPrismaRepository(),
  ).execute({
    traineeId,
    ...props,
  });

  revalidatePath('(header)/(auth)/home/categories');
}
