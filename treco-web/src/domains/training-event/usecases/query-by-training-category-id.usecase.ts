import { TrainingEventQuery } from './training-event.query';

type Props = {
  trainingCategoryId: string;
};

export class TrainingEventQueryByTrainingCategoryId {
  constructor(private trainingEventQuery: TrainingEventQuery) {}

  async execute({ trainingCategoryId }: Props) {
    return await this.trainingEventQuery.queryListByTrainingCategoryId(
      trainingCategoryId,
    );
  }
}
