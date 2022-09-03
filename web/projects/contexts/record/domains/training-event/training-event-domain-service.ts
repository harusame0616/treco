import { TrainingEventRepository } from '../../usecases/training-event-command-usecase';
import {
  TrainingEvent,
  TrainingEventCreateProp,
} from '../training-event/training-event';

export class TrainingEventDomainService {
  constructor(
    private prop: {
      trainingEventRepository: TrainingEventRepository;
    }
  ) {}

  async createNewTrainingEvent(
    prop: Omit<TrainingEventCreateProp, 'order'>
  ): Promise<TrainingEvent> {
    const lastOrderTrainingEvent =
      await this.prop.trainingEventRepository.findOneByLastOrder({
        userId: prop.userId,
        categoryId: prop.categoryId,
      });

    return TrainingEvent.create({
      ...prop,
      order: (lastOrderTrainingEvent?.order ?? -1) + 1,
    });
  }
}
