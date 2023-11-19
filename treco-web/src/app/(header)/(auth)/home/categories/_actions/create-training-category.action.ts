'use server';

import { DomainEventPublisher } from '@/domains/lib/domain-event-publisher';
import { TraineePrismaRepository } from '@/domains/trainee/infrastructures/prisma.repository';
import { TrainingCategoryPrismaRepository } from '@/domains/training-category/infrastructures/prisma.repository';
import { TrainingCategoryCreateUsecase } from '@/domains/training-category/usecases/create.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { revalidatePath } from 'next/cache';

type Props = {
  color: string;
  name: string;
};

export async function createTrainingCategoryAction(props: Props) {
  const traineeId = await getSignedInTraineeId();

  await new TrainingCategoryCreateUsecase(
    new TraineePrismaRepository(new DomainEventPublisher()),
    new TrainingCategoryPrismaRepository(new DomainEventPublisher()),
  ).execute({
    traineeId,
    ...props,
  });

  revalidatePath('(header)/(auth)/home/categories');
}
