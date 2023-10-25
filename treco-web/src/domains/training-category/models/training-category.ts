import { generateId } from '@/lib/id';

export type TrainingCategoryDto = {
  color: string;
  name: string;
  order: number;
  traineeId: string;
  trainingCategoryId: string;
};

export class TrainingCategory {
  private constructor(private dto: TrainingCategoryDto) {}

  static create(props: {
    traineeId: string;
    name: string;
    color: string;
    order: number;
  }) {
    return new TrainingCategory({
      ...props,
      trainingCategoryId: generateId(),
    });
  }

  static fromDto(dto: TrainingCategoryDto) {
    return new TrainingCategory(dto);
  }

  changeName(name: string) {
    this.dto.name = name;
  }

  changeColor(color: string) {
    this.dto.color = color;
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
