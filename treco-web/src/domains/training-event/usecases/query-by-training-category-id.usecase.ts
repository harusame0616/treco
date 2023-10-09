import { IMTrainingEventQuery } from '../infrastructures/im.query';

type Props = {
  trainingCategoryId: string;
};

export class TrainingEventQueryByTrainingCategoryId {
  trainingCategoryQuery = new IMTrainingEventQuery();

  constructor() {}

  async execute({ trainingCategoryId }: Props) {
    return await this.trainingCategoryQuery.queryListByTrainingCategoryId(
      trainingCategoryId
    );
  }
}
