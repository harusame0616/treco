'use server';

import { PrismaTrainingRecordRepository } from '@/domains/training-record/infrastructures/prisma.repository';
import { TrainingRecordEditSetUsecase } from '@/domains/training-record/usecases/edit-set.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { coerce, maxLength, number, object, parse, string } from 'valibot';

const inputSchema = object({
  load: coerce(number(), Number),
  note: string([maxLength(255)]),
  value: coerce(number(), Number),
});

const editSetUsecase = new TrainingRecordEditSetUsecase(
  new PrismaTrainingRecordRepository(),
);

type EditSetActionProps = {
  index: number;
  trainingRecordId: string;
};
export async function editSetAction(
  props: EditSetActionProps,
  formData: FormData,
) {
  await editSetUsecase.execute({
    ...props,
    ...parse(inputSchema, Object.fromEntries(formData.entries())),
    traineeId: await getSignedInTraineeId(),
  });

  revalidatePath(`/home/records/${props.trainingRecordId}`);
  redirect(`/home/records/${props.trainingRecordId}`);
}
