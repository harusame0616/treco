'use server';

import { TrainingEventPrismaRepository } from '@/domains/training-event/infrastructures/prisma.repository';
import { TrainingEventEditUsecase } from '@/domains/training-event/usecases/edit.usecase';
import { revalidatePath } from 'next/cache';

type EditTrainingEventProps = {
  loadUnit: string;
  name: string;
  trainingCategoryId: string;
  trainingEventId: string;
  valueUnit: string;
};

export async function editTrainingEventAction(props: EditTrainingEventProps) {
  await new TrainingEventEditUsecase(
    new TrainingEventPrismaRepository(),
  ).execute(props);

  revalidatePath(`/home/categories/${props.trainingCategoryId}`, 'page');
}
