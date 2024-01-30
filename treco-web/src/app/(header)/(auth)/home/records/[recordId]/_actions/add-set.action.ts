'use server';

import { PrismaTrainingRecordRepository } from '@/domains/training-record/infrastructures/prisma.repository';
import { TrainingRecordAddSetUsecase } from '@/domains/training-record/usecases/add-set.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { revalidatePath } from 'next/cache';
import { coerce, maxLength, number, object, parse, string } from 'valibot';

const inputSchema = object({
  load: coerce(number(), Number),
  note: string([maxLength(255)]),
  value: coerce(number(), Number),
});

const addSetUsecase = new TrainingRecordAddSetUsecase(
  new PrismaTrainingRecordRepository(),
);

type Props = {
  trainingRecordId: string;
};
export async function addSetAction(props: Props, formData: FormData) {
  await addSetUsecase.execute({
    ...parse(inputSchema, Object.fromEntries(formData.entries())),
    ...props,
    traineeId: await getSignedInTraineeId(),
  });

  revalidatePath(`/home/records/${props.trainingRecordId}`);
}
