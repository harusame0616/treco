import { TrainingRecord } from '../models/training-record';

export interface TrainingRecordRepository {
  delete(trainingRecordId: string): Promise<void>;
  findOneById(trainingRecordId: string): Promise<TrainingRecord>;
  save(trainingRecord: TrainingRecord): Promise<void>;
}
