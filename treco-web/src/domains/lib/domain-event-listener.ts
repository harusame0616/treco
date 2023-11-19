import EventEmitter from 'events';

import { DomainEvent } from './domain-event';

export class DomainEventListener {
  static emitter = new EventEmitter();

  static emit(eventName: string, event: DomainEvent) {
    this.emitter.emit(eventName, event);
  }

  static on<T extends DomainEvent>(
    eventName: string,
    callback: (event: T) => Promise<void>,
  ) {
    this.emitter.on(eventName, callback);
  }

  static {
    this.emitter.setMaxListeners(0);
  }
}
