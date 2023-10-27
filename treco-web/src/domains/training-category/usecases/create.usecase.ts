import { TraineeRepository } from '../../trainee/usecases/repository';
import { TrainingCategory } from '../models/training-category';
import { TrainingCategoryRepository } from './repository';

type ExecuteProps = {
  color: string;
  name: string;
  traineeId: string;
};

export class TrainingCategoryCreateUsecase {
  constructor(
    private traineeRepository: TraineeRepository,
    private trainingCategoryRepository: TrainingCategoryRepository,
  ) {}

  async execute(props: ExecuteProps) {
    const { color, name, traineeId } = props;

    await this.traineeRepository.findOneById(traineeId);

    const lastOrderTrainingCategory =
      await this.trainingCategoryRepository.findOneByOrder({
        order: 'last',
        traineeId,
      });

    const trainingCategory = TrainingCategory.create({
      color,
      name,
      order: lastOrderTrainingCategory
        ? lastOrderTrainingCategory.order + 1
        : 0,
      traineeId,
    });

    await this.trainingCategoryRepository.save(trainingCategory);
  }
}
