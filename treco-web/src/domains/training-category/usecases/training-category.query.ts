import { TrainingCategoryDto } from '../models/training-category';

export interface TrainingCategoryQuery {
  queryListByTraineeId(traineeId: string): Promise<TrainingCategoryDto[]>;
}
