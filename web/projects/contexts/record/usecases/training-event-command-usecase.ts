import { ConflictError } from '../../../custom-error/conflict-error';
import { NotFoundError } from '../../../custom-error/not-found-error';
import {
  TrainingEvent,
  TrainingEventCreateProp,
  TrainingEventDto,
  TrainingEventFullId,
} from '../domains/training-event/training-event';
import { TrainingEventDomainService } from '../domains/training-event/training-event-domain-service';

export interface TrainingEventRepository {
  save(trainingEvent: TrainingEvent): Promise<void>;
  findOneByTrainingEventId(
    prop: TrainingEventFullId
  ): Promise<TrainingEvent | null>;
  findOneByTrainingEventName(prop: {
    userId: string;
    categoryId: string;
    trainingEventName: string;
  }): Promise<TrainingEvent | null>;
  findOneByLastOrder(prop: {
    userId: string;
    categoryId: string;
  }): Promise<TrainingEvent | null>;
  deleteTrainingEvent(trainingEvent: TrainingEvent): Promise<void>;
}

interface ConstructorProp {
  trainingEventRepository: TrainingEventRepository;
}

export class TrainingEventCommandUsecase {
  private trainingEventDomainService: TrainingEventDomainService;

  constructor(private prop: ConstructorProp) {
    this.trainingEventDomainService = new TrainingEventDomainService(prop);
  }

  async createNewTrainingEvent(
    prop: Omit<TrainingEventCreateProp, 'order'>
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

    const trainingEvent =
      await this.trainingEventDomainService.createNewTrainingEvent(prop);

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

  async deleteTrainingEvent(prop: TrainingEventFullId) {
    const trainingEvent =
      await this.prop.trainingEventRepository.findOneByTrainingEventId(prop);

    if (!trainingEvent) {
      return;
    }

    await this.prop.trainingEventRepository.deleteTrainingEvent(trainingEvent);
  }
}
