import { TrainingCategoryDto } from '../models/training-cateogry';

export interface TrainingCategoryQuery {
  queryListByTraineeId(traineeId: string): Promise<TrainingCategoryDto[]>;
}
