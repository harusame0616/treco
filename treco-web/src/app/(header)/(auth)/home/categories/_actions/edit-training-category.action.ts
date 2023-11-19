'use server';
import { DomainEventPublisher } from '@/domains/lib/domain-event-publisher';
import { TrainingCategoryPrismaRepository } from '@/domains/training-category/infrastructures/prisma.repository';
import { TrainingCategoryEditUsecase } from '@/domains/training-category/usecases/edit.usecase';
import { revalidatePath } from 'next/cache';

type Props = {
  color: string;
  name: string;
  trainingCategoryId: string;
};

export async function editTrainingCategoryAction(props: Props) {
  await new TrainingCategoryEditUsecase(
    new TrainingCategoryPrismaRepository(new DomainEventPublisher()),
  ).execute(props);

  revalidatePath('(header)/(auth)/home/categories');
}
