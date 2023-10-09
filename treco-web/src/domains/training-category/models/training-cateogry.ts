import { generateId } from '@/lib/id';

export type TrainingCategoryDto = {
  trainingCategoryId: string;
  name: string;
  traineeId: string;
  order: number;
  color: string;
};

export class TrainingCategory {
  private constructor(private dto: TrainingCategoryDto) {}

  toDto() {
    return {
      ...this.dto,
    };
  }

  static fromDto(dto: TrainingCategoryDto) {
    return new TrainingCategory(dto);
  }
}
