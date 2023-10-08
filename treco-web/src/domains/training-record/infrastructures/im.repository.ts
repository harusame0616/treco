import { TrainingRecord, TrainingRecordDto } from '../models/training-record';

declare global {
  var trainingRecordStore: Map<string, TrainingRecordDto> | undefined;
}

global.trainingRecordStore =
  global.trainingRecordStore || new Map<string, TrainingRecordDto>();

export class IMTrainingRecordRepository {
  trainingRecordStore;
  constructor() {
    if (global.trainingRecordStore === undefined) {
      throw new Error('global.trainingRecordStore is undefined');
    }

    this.trainingRecordStore = global.trainingRecordStore;
  }

  async save(trainingRecord: TrainingRecord) {
    const dto = trainingRecord.toDto();
    this.trainingRecordStore.set(dto.trainingEventId, dto);
  }
}
