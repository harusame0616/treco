import { TrainingCategory } from '../models/training-category';

export interface TrainingCategoryRepository {
  findById(id: string): Promise<TrainingCategory>;
  save(trainingCategory: TrainingCategory): Promise<void>;
}
