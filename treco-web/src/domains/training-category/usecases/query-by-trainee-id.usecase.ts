import { TrainingCategoryQuery } from './training-category.query';

type Props = {
  traineeId: string;
};

export class TrainingCategoryQueryByTraineeIdUsecase {
  constructor(private trainingCategoryQuery: TrainingCategoryQuery) {}

  async execute({ traineeId }: Props) {
    return await this.trainingCategoryQuery.queryListByTraineeId(traineeId);
  }
}
