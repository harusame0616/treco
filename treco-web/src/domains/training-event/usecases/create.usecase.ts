import { TraineeRepository } from '../../trainee/usecases/repository';
import { TrainingCategoryRepository } from '../../training-category/usecases/repository';
import { TrainingEvent } from '../models/training-event';
import { TrainingEventRepository } from './repository';

type ExecuteProps = {
  loadUnit: string;
  name: string;
  traineeId: string;
  trainingCategoryId: string;
  valueUnit: string;
};

export class TrainingEventCreateUsecase {
  constructor(
    private traineeRepository: TraineeRepository,
    private trainingCategoryRepository: TrainingCategoryRepository,
    private trainingEventRepository: TrainingEventRepository,
  ) {}

  async execute({
    loadUnit,
    name,
    traineeId,
    trainingCategoryId,
    valueUnit,
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
        order: 'last',
        trainingCategoryId,
      });

    const trainingEvent = TrainingEvent.create({
      loadUnit,
      name,
      order: lastOrderTrainingEvent ? lastOrderTrainingEvent.order + 1 : 0,
      traineeId,
      trainingCategoryId,
      valueUnit,
    });

    await this.trainingEventRepository.save(trainingEvent);
  }
}
