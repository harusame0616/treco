import { DomainEvent } from '@/domains/lib/domain-event';

export class TrainingCategoryCreateDefaultEvent implements DomainEvent {
  readonly name = 'TrainingCategoryCreateDefaultEvent';
  readonly traineeId: string;
  readonly trainingCategoryId: string;
  readonly trainingCategoryName: string;

  constructor(params: {
    traineeId: string;
    trainingCategoryId: string;
    trainingCategoryName: string;
  }) {
    this.traineeId = params.traineeId;
    this.trainingCategoryId = params.trainingCategoryId;
    this.trainingCategoryName = params.trainingCategoryName;
  }
}
