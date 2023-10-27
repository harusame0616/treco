import { generateId } from '@/lib/id';

export type TrainingEventDto = {
  loadUnit: string;
  name: string;
  order: number;
  traineeId: string;
  trainingCategoryId: string;
  trainingEventId: string;
  valueUnit: string;
};

export class TrainingEvent {
  private constructor(private dto: TrainingEventDto) {}

  static fromDto(dto: TrainingEventDto) {
    return new TrainingEvent(dto);
  }

  static create(props: {
    traineeId: string;
    trainingCategoryId: string;
    name: string;
    valueUnit: string;
    loadUnit: string;
    order: number;
  }) {
    return new TrainingEvent({
      ...props,
      trainingEventId: generateId(),
    });
  }

  get order() {
    return this.dto.order;
  }

  toDto() {
    return {
      ...this.dto,
    };
  }
}
