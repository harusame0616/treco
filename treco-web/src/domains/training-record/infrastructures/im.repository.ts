import { TrainingRecord, TrainingRecordDto } from '../models/training-record';
import { trainingRecordStore } from './im.store';

export class IMTrainingRecordRepository {
  constructor() {
    if (trainingRecordStore === undefined) {
      throw new Error('global.trainingRecordStore is undefined');
    }
  }

  async findOneById(trainingRecordId: string) {
    const dto = trainingRecordStore.get(trainingRecordId);
    return dto ? TrainingRecord.fromDto(dto) : null;
  }

  async save(trainingRecord: TrainingRecord) {
    const dto = trainingRecord.toDto();
    trainingRecordStore.set(dto.trainingRecordId, dto);
  }
}
