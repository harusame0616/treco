import { TrainingEventDto } from '../models/training-event';

export interface TrainingEventQuery {
  queryListByTrainingCategoryId(
    trainingCategoryId: string
  ): Promise<TrainingEventDto[]>;
}
