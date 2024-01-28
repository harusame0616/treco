import { PrismaTrainingCategoryQuery } from '@/domains/training-category/infrastructures/prisma.query';
import { TrainingCategoryQueryByTraineeIdUsecase } from '@/domains/training-category/usecases/query-by-trainee-id.usecase';
import { PrismaTrainingEventQuery } from '@/domains/training-event/infrastructures/prisma.query';
import { TrainingEventQueryByTrainingCategoryId } from '@/domains/training-event/usecases/query-by-training-category-id.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { notFound } from 'next/navigation';
import React from 'react';

export async function queryTrainingEvents(trainingCategoryId: string) {
  const query = new TrainingEventQueryByTrainingCategoryId(
    new PrismaTrainingEventQuery(),
  );
  return await query.execute({ trainingCategoryId });
}

async function queryCategory(trainingCategoryId: string) {
  const signedInTraineeId = await getSignedInTraineeId();

  const query = new TrainingCategoryQueryByTraineeIdUsecase(
    new PrismaTrainingCategoryQuery(),
  );
  const categories = await query.execute({ traineeId: signedInTraineeId });

  const category = categories.find(
    (category) => category.trainingCategoryId === trainingCategoryId,
  );

  if (!category) {
    return notFound();
  }

  return category;
}

export const cachedQueryCategory = React.cache(queryCategory);
