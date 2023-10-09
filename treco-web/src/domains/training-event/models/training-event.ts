import { generateId } from '@/lib/id';

export type TrainingEventDto = {
  trainingEventId: string;
  trainingCategoryId: string;
  name: string;
  traineeId: string;
  order: number;
  loadUnit: string;
  valueUnit: string;
};

export class TrainingEvent {
  private constructor(private dto: TrainingEventDto) {}

  toDto() {
    return {
      ...this.dto,
    };
  }

  static fromDto(dto: TrainingEventDto) {
    return new TrainingEvent(dto);
  }
}
