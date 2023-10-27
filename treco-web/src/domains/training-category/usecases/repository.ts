import { TrainingCategory } from '../models/training-category';

export interface TrainingCategoryRepository {
  findById(trainingCategoryId: string): Promise<TrainingCategory>;
  findOneByOrder(props: {
    order: 'last';
    traineeId: string;
  }): Promise<TrainingCategory | null>;
  save(trainingCategory: TrainingCategory): Promise<void>;
}
