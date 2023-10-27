import { TrainingCategoryRepository } from '../../training-category/usecases/repository';
import { TraineeRepository } from '../../trainee/usecases/repository';
import { TrainingEvent } from '../models/training-event';
import { TrainingEventRepository } from './repository';

type ExecuteProps = {
  traineeId: string;
  trainingCategoryId: string;
  name: string;
  valueUnit: string;
  loadUnit: string;
};

export class TrainingEventCreateUsecase {
  constructor(
    private traineeRepository: TraineeRepository,
    private trainingCategoryRepository: TrainingCategoryRepository,
    private trainingEventRepository: TrainingEventRepository,
  ) {}

  async execute({
    traineeId,
    trainingCategoryId,
    valueUnit,
    name,
    loadUnit,
  }: ExecuteProps) {
    const [trainee, trainingCategory] = await Promise.all([
      this.traineeRepository.findOneById(traineeId),
      this.trainingCategoryRepository.findById(trainingCategoryId),
    ]);

    if (!trainee) {
      throw new Error('トレーニーが見つかりません');
    }

    if (!trainingCategory) {
      throw new Error('トレーニングカテゴリが見つかりません');
    }

    const lastOrderTrainingEvent =
      await this.trainingEventRepository.findOneByOrder({
        trainingCategoryId,
        order: 'last',
      });

    const trainingEvent = TrainingEvent.create({
      traineeId,
      name,
      trainingCategoryId,
      valueUnit,
      loadUnit,
      order: lastOrderTrainingEvent ? lastOrderTrainingEvent.order + 1 : 0,
    });

    await this.trainingEventRepository.save(trainingEvent);
  }
}
