import { TrainingCategoryRepository } from './repository';

type ExecuteProps = {
  color: string;
  name: string;
  trainingCategoryId: string;
};

export class TrainingCategoryEditUsecase {
  constructor(private trainingCategoryRepository: TrainingCategoryRepository) {}

  async execute(props: ExecuteProps) {
    const { color, name, trainingCategoryId } = props;

    const trainingCategory =
      await this.trainingCategoryRepository.findById(trainingCategoryId);

    trainingCategory.changeName(name);
    trainingCategory.changeColor(color);

    await this.trainingCategoryRepository.save(trainingCategory);
  }
}
