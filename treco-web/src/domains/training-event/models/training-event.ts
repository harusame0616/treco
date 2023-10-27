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

  static create(props: {
    loadUnit: string;
    name: string;
    order: number;
    traineeId: string;
    trainingCategoryId: string;
    valueUnit: string;
  }) {
    return new TrainingEvent({
      ...props,
      trainingEventId: generateId(),
    });
  }

  static fromDto(dto: TrainingEventDto) {
    return new TrainingEvent(dto);
  }

  toDto() {
    return {
      ...this.dto,
    };
  }

  get order() {
    return this.dto.order;
  }
}
