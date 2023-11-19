import { DomainEventPublisher } from '@/domains/lib/domain-event-publisher';

import { Trainee } from '../models/trainee';

export abstract class TraineeRepository {
  constructor(private domainEventPublisher: DomainEventPublisher) {}

  private publishDomainEvent(trainee: Trainee) {
    trainee
      .getDomainEvents()
      .map(async (event) => this.domainEventPublisher.publish(event));
    trainee.clearDomainEvents();
  }

  async save(trainee: Trainee): Promise<void> {
    await this.saveImpl(trainee);
    this.publishDomainEvent(trainee);
  }

  abstract findOneById(traineeId: string): Promise<Trainee | null>;

  protected abstract saveImpl(trainee: Trainee): Promise<void>;
}
