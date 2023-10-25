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

  changeName(name: string) {
    this.dto.name = name;
  }

  changeColor(color: string) {
    this.dto.color = color;
  }

  toDto() {
    return {
      ...this.dto,
    };
  }
}
