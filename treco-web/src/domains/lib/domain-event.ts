import EventEmitter from 'events';

export const eventEmitter = new EventEmitter();

export interface DomainEvent {
  name: string;
}
