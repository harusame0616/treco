import { DomainEvent } from '@/domains/lib/domain-event';

type Props = {
  traineeId: string;
};

export class TraineeCreateEvent implements DomainEvent {
  name = 'TraineeCreateEvent';
  traineeId: string;

  constructor({ traineeId }: Props) {
    this.traineeId = traineeId;
  }
}
