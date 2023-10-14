import { TrainingRecordQuery } from './training-record.query';

export class TrainingRecordQueryListForHomeUsecase {
  constructor(private trainingRecordQuery: TrainingRecordQuery) {}

  execute(traineeId: string, date: Date) {
    return this.trainingRecordQuery.queryTrainingRecordForHome(traineeId, date);
  }
}
