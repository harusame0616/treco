import { TrainingEvent } from '../models/training-event';

export interface TrainingEventRepository {
  findOneByOrder(props: {
    trainingCategoryId: string;
    order: 'last';
  }): Promise<TrainingEvent | null>;

  save(trainingEvent: TrainingEvent): Promise<void>;
}
