import { ConflictError } from '../../../custom-error/conflict-error';
import {
  TrainingEvent,
  TrainingEventCreateProp,
  TrainingEventDto,
} from '../domains/training-event/training-event';

export interface TrainingEventRepository {
  insert(trainingEvent: TrainingEvent): Promise<void>;
  findOneByTrainingEventName(prop: {
    userId: string;
    categoryId: string;
    trainingEventName: string;
  }): Promise<TrainingEvent | null>;
}

interface ConstructorProp {
  trainingEventRepository: TrainingEventRepository;
}

export class TrainingEventCommandUsecase {
  constructor(private prop: ConstructorProp) {}

  async createNewTrainingEvent(
    prop: TrainingEventCreateProp
  ): Promise<TrainingEventDto> {
    const registeredTrainingEvent =
      await this.prop.trainingEventRepository.findOneByTrainingEventName({
        userId: prop.userId,
        categoryId: prop.categoryId,
        trainingEventName: prop.trainingEventName,
      });

    if (registeredTrainingEvent) {
      throw new ConflictError('同じ名前のトレーニング種目が存在します。', {
        prop,
      });
    }

    const trainingEvent = TrainingEvent.create(prop);

    await this.prop.trainingEventRepository.insert(trainingEvent);
    return trainingEvent.toDto();
  }
}
