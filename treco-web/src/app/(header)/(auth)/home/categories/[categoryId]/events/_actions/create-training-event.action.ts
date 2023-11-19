'use server';

import { DomainEventPublisher } from '@/domains/lib/domain-event-publisher';
import { TraineePrismaRepository } from '@/domains/trainee/infrastructures/prisma.repository';
import { TrainingCategoryPrismaRepository } from '@/domains/training-category/infrastructures/prisma.repository';
import { TrainingEventPrismaRepository } from '@/domains/training-event/infrastructures/prisma.repository';
import { TrainingEventCreateUsecase } from '@/domains/training-event/usecases/create.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { revalidatePath } from 'next/cache';

type CreateTrainingEventProps = {
  loadUnit: string;
  name: string;
  trainingCategoryId: string;
  valueUnit: string;
};

export async function createTrainingEventAction(
  props: CreateTrainingEventProps,
) {
  const traineeId = await getSignedInTraineeId();

  await new TrainingEventCreateUsecase(
    new TraineePrismaRepository(new DomainEventPublisher()),
    new TrainingCategoryPrismaRepository(new DomainEventPublisher()),
    new TrainingEventPrismaRepository(),
  ).execute({
    traineeId,
    ...props,
  });

  revalidatePath(`/home/categories/${props.trainingCategoryId}`, 'page');
}
