import { DomainEvent } from '@/domains/lib/domain-event';
import { generateId } from '@/lib/id';

import { TraineeCreateEvent } from './trainee-create-event';

export type TraineeDto = {
  authUserId: string;
  name: string;
  traineeId: string;
};

type TraineeCreateProps = Omit<TraineeDto, 'traineeId'>;

export class Trainee {
  private domainEvents: DomainEvent[] = [];

  private constructor(private dto: TraineeDto) {}

  static create(props: TraineeCreateProps) {
    const traineeId = generateId();

    const trainee = new Trainee({
      authUserId: props.authUserId,
      name: props.name,
      traineeId,
    });
    trainee.addDomainEvent(new TraineeCreateEvent({ traineeId }));

    return trainee;
  }

  static fromDto(dto: TraineeDto) {
    return new Trainee(dto);
  }

  addDomainEvent(event: DomainEvent) {
    this.domainEvents.push(event);
  }

  clearDomainEvents() {
    this.domainEvents = [];
  }

  getDomainEvents() {
    return this.domainEvents;
  }

  toDto() {
    return { ...this.dto };
  }
}
