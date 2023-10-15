export type TrainingCategoryDto = {
  color: string;
  name: string;
  order: number;
  traineeId: string;
  trainingCategoryId: string;
};

export class TrainingCategory {
  private constructor(private dto: TrainingCategoryDto) {}

  static fromDto(dto: TrainingCategoryDto) {
    return new TrainingCategory(dto);
  }

  toDto() {
    return {
      ...this.dto,
    };
  }
}
