import { DomainEventListener } from '@/domains/lib/domain-event-listener';

import { TrainingCategoryCreateDefaultEvent } from '../models/training-category-create-default';
import { TrainingEvent } from '../models/training-event';
import { TrainingEventRepository } from './repository';

export class TrainingEventEventListener {
  constructor(private repository: TrainingEventRepository) {}

  private async callback(event: TrainingCategoryCreateDefaultEvent) {
    await Promise.all(
      TrainingEvent.createDefaultTrainingEvents({
        traineeId: event.traineeId,
        trainingCategoryId: event.trainingCategoryId,
        trainingCategoryName: event.trainingCategoryName,
      }).map((trainingCategory) => this.repository.save(trainingCategory)),
    );
  }

  listen() {
    DomainEventListener.on(
      'TrainingCategoryCreateDefaultEvent',
      async (event: TrainingCategoryCreateDefaultEvent) =>
        await this.callback(event),
    );
  }
}
