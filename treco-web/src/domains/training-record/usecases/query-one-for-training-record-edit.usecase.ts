import { TrainingRecordQuery } from './training-record.query';

export class TrainingRecordQueryOneForTrainingRecordEditUsecase {
  constructor(private trainingRecordQuery: TrainingRecordQuery) {}

  execute(recordId: string) {
    return this.trainingRecordQuery.queryOneForRecordEdit(recordId);
  }
}
