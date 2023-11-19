import { DomainEvent } from '@/domains/lib/domain-event';
import { generateId } from '@/lib/id';

import { getDefaultCategories } from '../lib/default-categories';
import { TrainingCategoryCreateDefaultEvent } from './training-category-create-default';

export type TrainingCategoryDto = {
  color: string;
  name: string;
  order: number;
  traineeId: string;
  trainingCategoryId: string;
};

export class TrainingCategory {
  private domainEvents: DomainEvent[] = [];
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

  static createDefaultCategories(props: { traineeId: string }) {
    return getDefaultCategories().map((trainingCategoryDto, order) => {
      const trainingCategoryId = generateId();
      const trainingCategory = new TrainingCategory({
        ...trainingCategoryDto,
        order,
        traineeId: props.traineeId,
        trainingCategoryId,
      });
      trainingCategory.addDomainEvent(
        new TrainingCategoryCreateDefaultEvent({
          traineeId: props.traineeId,
          trainingCategoryId,
          trainingCategoryName: trainingCategoryDto.name,
        }),
      );

      return trainingCategory;
    });
  }

  static fromDto(dto: TrainingCategoryDto) {
    return new TrainingCategory(dto);
  }

  addDomainEvent(event: DomainEvent) {
    this.domainEvents.push(event);
  }

  changeColor(color: string) {
    this.dto.color = color;
  }

  changeName(name: string) {
    this.dto.name = name;
  }

  clearDomainEvents() {
    this.domainEvents = [];
  }

  getDomainEvents() {
    return this.domainEvents;
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
