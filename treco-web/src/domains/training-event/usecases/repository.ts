import { TrainingEvent } from '../models/training-event';

export interface TrainingEventRepository {
  findOneByOrder(props: {
    order: 'last';
    trainingCategoryId: string;
  }): Promise<TrainingEvent | null>;

  save(trainingEvent: TrainingEvent): Promise<void>;
}
