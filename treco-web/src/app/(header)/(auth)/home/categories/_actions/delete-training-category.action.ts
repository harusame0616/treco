'use server';

import { DomainEventPublisher } from '@/domains/lib/domain-event-publisher';
import { TrainingCategoryPrismaRepository } from '@/domains/training-category/infrastructures/prisma.repository';
import { TrainingCategoryDeleteUsecase } from '@/domains/training-category/usecases/delete.usecase';
import { revalidatePath } from 'next/cache';

export async function deleteTrainingCategoryAction(trainingCategoryId: string) {
  await new TrainingCategoryDeleteUsecase(
    new TrainingCategoryPrismaRepository(new DomainEventPublisher()),
  ).execute({ trainingCategoryId });

  revalidatePath('(header)/(auth)/home/categories');
}
