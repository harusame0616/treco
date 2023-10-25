import { TrainingCategoryRepository } from './repository';

type ExecuteProps = {
  trainingCategoryId: string;
  name: string;
  color: string;
};

export class TrainingCategoryEditUsecase {
  constructor(private trainingCategoryRepository: TrainingCategoryRepository) {}

  async execute(props: ExecuteProps) {
    const { trainingCategoryId, name, color } = props;

    const trainingCategory =
      await this.trainingCategoryRepository.findById(trainingCategoryId);

    trainingCategory.changeName(name);
    trainingCategory.changeColor(color);

    await this.trainingCategoryRepository.save(trainingCategory);
  }
}
