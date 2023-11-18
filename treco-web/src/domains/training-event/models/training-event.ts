import { generateId } from '@/lib/id';

import { getDefaultEvents } from '../lib/default-events';

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

  static createDefaultTrainingEvents(props: {
    traineeId: string;
    trainingCategoryId: string;
    trainingCategoryName: string;
  }) {
    return getDefaultEvents(props.trainingCategoryName).map(
      (trainingCategoryDto, order) =>
        new TrainingEvent({
          loadUnit: trainingCategoryDto.loadUnit,
          name: trainingCategoryDto.name,
          order,
          traineeId: props.traineeId,
          trainingCategoryId: props.trainingCategoryId,
          trainingEventId: generateId(),
          valueUnit: trainingCategoryDto.valueUnit,
        }),
    );
  }

  static fromDto(dto: TrainingEventDto) {
    return new TrainingEvent(dto);
  }

  changeLoadUnit(loadUnit: string) {
    this.dto.loadUnit = loadUnit;
  }
  changeName(name: string) {
    this.dto.name = name;
  }

  changeValueUnit(valueUnit: string) {
    this.dto.valueUnit = valueUnit;
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
