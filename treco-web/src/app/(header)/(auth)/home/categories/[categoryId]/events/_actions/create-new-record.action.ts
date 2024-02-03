'use server';

import { PrismaTrainingRecordRepository } from '@/domains/training-record/infrastructures/prisma.repository';
import { TrainingRecordCreateUsecase } from '@/domains/training-record/usecases/create.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { redirect } from 'next/navigation';

const createUsecase = new TrainingRecordCreateUsecase(
  new PrismaTrainingRecordRepository(),
);

type CreateNewRecordActionProps = {
  trainingDate: Date;
  trainingEventId: string;
};
export async function createNewRecordAction(props: CreateNewRecordActionProps) {
  const newRecord = await createUsecase.execute({
    ...props,
    traineeId: await getSignedInTraineeId(),
    trainingDate: new Date(props.trainingDate),
  });

  redirect(`/home/records/${newRecord.trainingRecordId}`);
}
