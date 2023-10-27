import { TrainingCategoryRepository } from './repository';

type ExecuteProps = {
  trainingCategoryId: string;
};

export class TrainingCategoryDeleteUsecase {
  constructor(private trainingCategoryRepository: TrainingCategoryRepository) {}

  async execute({ trainingCategoryId }: ExecuteProps) {
    await this.trainingCategoryRepository.delete(trainingCategoryId);
  }
}
