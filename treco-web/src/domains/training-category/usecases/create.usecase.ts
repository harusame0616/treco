import { TrainingCategoryRepository } from './repository';
import { TraineeRepository } from '../../trainee/usecases/repository';
import { TrainingCategory } from '../models/training-category';

type ExecuteProps = {
  traineeId: string;
  name: string;
  color: string;
};

export class TrainingCategoryCreateUsecase {
  constructor(
    private traineeRepository: TraineeRepository,
    private trainingCategoryRepository: TrainingCategoryRepository,
  ) {}

  async execute(props: ExecuteProps) {
    const { traineeId, name, color } = props;

    await this.traineeRepository.findOneById(traineeId);

    const lastOrderTrainingCategory =
      await this.trainingCategoryRepository.findOneByOrder({
        traineeId,
        order: 'last',
      });

    const trainingCategory = TrainingCategory.create({
      traineeId,
      name,
      color,
      order: lastOrderTrainingCategory
        ? lastOrderTrainingCategory.order + 1
        : 0,
    });

    await this.trainingCategoryRepository.save(trainingCategory);
  }
}
