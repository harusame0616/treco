'use server';

import { TrainingEventPrismaRepository } from '@/domains/training-event/infrastructures/prisma.repository';
import { TrainingEventDeleteUsecase } from '@/domains/training-event/usecases/delete.usecase';
import { revalidatePath } from 'next/cache';

type Props = {
  trainingCategoryId: string;
  trainingEventId: string;
};

export async function deleteTrainingEventAction(props: Props) {
  await new TrainingEventDeleteUsecase(
    new TrainingEventPrismaRepository(),
  ).execute(props);

  revalidatePath(`/home/categories/${props.trainingCategoryId}`, 'page');
}
