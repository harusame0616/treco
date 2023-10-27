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
    color: string;
    name: string;
    order: number;
    traineeId: string;
  }) {
    return new TrainingCategory({
      ...props,
      trainingCategoryId: generateId(),
    });
  }

  static fromDto(dto: TrainingCategoryDto) {
    return new TrainingCategory(dto);
  }

  changeColor(color: string) {
    this.dto.color = color;
  }

  changeName(name: string) {
    this.dto.name = name;
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
