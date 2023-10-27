import { TrainingCategory } from '../models/training-category';

export interface TrainingCategoryRepository {
  findById(trainingCategoryId: string): Promise<TrainingCategory>;
  findOneByOrder(props: {
    traineeId: string;
    order: 'last';
  }): Promise<TrainingCategory | null>;
  save(trainingCategory: TrainingCategory): Promise<void>;
}
