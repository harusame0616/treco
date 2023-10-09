import { IMTrainingCategoryQuery } from '../infrastructures/im.query';

type Props = {
  traineeId: string;
};

export class TrainingCategoryQueryByTraineeIdUsecase {
  trainingCategoryQuery = new IMTrainingCategoryQuery();
  constructor() {}
  async execute({ traineeId }: Props) {
    return await this.trainingCategoryQuery.queryListByTraineeId(traineeId);
  }
}
