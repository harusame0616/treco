import { TrainingEvent } from '../models/training-event';

export interface TrainingEventRepository {
  delete(trainingEventId: string): Promise<void>;
  findOneById(trainingEventId: string): Promise<TrainingEvent | null>;
  findOneByOrder(props: {
    order: 'last';
    trainingCategoryId: string;
  }): Promise<TrainingEvent | null>;
  save(trainingEvent: TrainingEvent): Promise<void>;
}
