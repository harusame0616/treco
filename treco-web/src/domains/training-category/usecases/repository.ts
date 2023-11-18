import { DomainEventPublisher } from '@/domains/lib/domain-event-publisher';

import { TrainingCategory } from '../models/training-category';

export abstract class TrainingCategoryRepository {
  constructor(private domainEventPublisher: DomainEventPublisher) {}

  private publishDomainEvent(trainingCategory: TrainingCategory) {
    trainingCategory
      .getDomainEvents()
      .map((event) => this.domainEventPublisher.publish(event));
    trainingCategory.clearDomainEvents();
  }
  async save(trainingCategory: TrainingCategory): Promise<void> {
    await this.saveImpl(trainingCategory);
    this.publishDomainEvent(trainingCategory);
  }
  abstract delete(trainingCategoryId: string): Promise<void>;
  abstract findById(trainingCategoryId: string): Promise<TrainingCategory>;

  abstract findOneByOrder(props: {
    order: 'last';
    traineeId: string;
  }): Promise<TrainingCategory | null>;

  abstract saveImpl(trainingCategory: TrainingCategory): Promise<void>;
}
