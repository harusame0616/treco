import { TrainingRecord } from '../models/training-record';

export interface TrainingRecordRepository {
  findOneById(trainingRecordId: string): Promise<TrainingRecord>;
  save(trainingRecord: TrainingRecord): Promise<void>;
}
