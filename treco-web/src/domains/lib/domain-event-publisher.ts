import { DomainEvent } from './domain-event';
import { DomainEventListener } from './domain-event-listener';

export class DomainEventPublisher {
  publish(event: DomainEvent) {
    DomainEventListener.emit(event.name, event);
  }
}
