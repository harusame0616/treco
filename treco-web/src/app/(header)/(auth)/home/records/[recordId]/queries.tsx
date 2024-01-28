import { PrismaTrainingRecordQuery } from '@/domains/training-record/infrastructures/prisma.query';
import { TrainingRecordQueryOneForTrainingRecordEditUsecase } from '@/domains/training-record/usecases/query-one-for-training-record-edit.usecase';
import React from 'react';

async function queryTrainingRecordEdit(trainingRecordId: string) {
  const queryUsecase = new TrainingRecordQueryOneForTrainingRecordEditUsecase(
    new PrismaTrainingRecordQuery(),
  );

  return await queryUsecase.execute(trainingRecordId);
}

export const cachedQueryTrainingRecordEdit = React.cache(
  queryTrainingRecordEdit,
);
