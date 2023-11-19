import { DomainEventListener } from '@/domains/lib/domain-event-listener';
import { TraineeCreateEvent } from '@/domains/trainee/models/trainee-create-event';

import { TrainingCategory } from '../models/training-category';
import { TrainingCategoryRepository } from './repository';

export class TrainingCategoryEventListener {
  constructor(private repository: TrainingCategoryRepository) {}

  private async callback(event: TraineeCreateEvent) {
    await Promise.all(
      TrainingCategory.createDefaultCategories({
        traineeId: event.traineeId,
      }).map((trainingCategory) => this.repository.save(trainingCategory)),
    );
  }

  listen() {
    DomainEventListener.on(
      'TraineeCreateEvent',
      async (event: TraineeCreateEvent) => await this.callback(event),
    );
  }
}
