import { ConflictError } from '../../../custom-error/conflict-error';
import { NotFoundError } from '../../../custom-error/not-found-error';
import {
  TrainingEvent,
  TrainingEventCreateProp,
  TrainingEventDto,
} from '../domains/training-event/training-event';

export interface TrainingEventRepository {
  save(trainingEvent: TrainingEvent): Promise<void>;
  findOneByTrainingEventId(prop: {
    userId: string;
    categoryId: string;
    trainingEventId: string;
  }): Promise<TrainingEvent | null>;
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

    await this.prop.trainingEventRepository.save(trainingEvent);
    return trainingEvent.toDto();
  }

  async editTrainingEvent(prop: TrainingEventDto): Promise<TrainingEventDto> {
    const [registeredTrainingEvent, sameNameTrainingEvent] = await Promise.all([
      this.prop.trainingEventRepository.findOneByTrainingEventId({
        userId: prop.userId,
        categoryId: prop.categoryId,
        trainingEventId: prop.trainingEventId,
      }),
      this.prop.trainingEventRepository.findOneByTrainingEventName({
        userId: prop.userId,
        categoryId: prop.categoryId,
        trainingEventName: prop.trainingEventName,
      }),
    ]);

    if (!registeredTrainingEvent) {
      throw new NotFoundError('トレーニング種目が見つかりませんでした。');
    }

    if (
      sameNameTrainingEvent &&
      sameNameTrainingEvent.trainingEventName !==
        registeredTrainingEvent.trainingEventName
    ) {
      throw new ConflictError('同じ名前のトレーニング種目が存在します。', {
        prop,
      });
    }

    registeredTrainingEvent.changeTrainingEventName(prop.trainingEventName);
    registeredTrainingEvent.changeValueUnit(prop.valueUnit);
    registeredTrainingEvent.changeLoadUnit(prop.loadUnit);

    await this.prop.trainingEventRepository.save(registeredTrainingEvent);
    return registeredTrainingEvent.toDto();
  }
}
