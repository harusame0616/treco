import { generateId } from '../../../../utils/id';

export interface TrainingEventDto {
  userId: string;
  categoryId: string;
  trainingEventId: string;
  trainingEventName: string;
  loadUnit: string;
  valueUnit: string;
}

export type ConstructorProp = TrainingEventDto;
export type TrainingEventCreateProp = Omit<ConstructorProp, 'trainingEventId'>;

export class TrainingEvent {
  static readonly TRAINING_EVENT_NAME_MAX_LENGTH = 24;
  static readonly LOAD_UNIT_MAX_LENGTH = 8;
  static readonly VALUE_UNIT_MAX_LENGTH = 8;

  constructor(private prop: ConstructorProp) {}

  static create(prop: TrainingEventCreateProp): TrainingEvent {
    return new TrainingEvent({ ...prop, trainingEventId: generateId() });
  }

  toDto(): TrainingEventDto {
    return { ...this.prop };
  }

  static fromDto(dto: TrainingEventDto): TrainingEvent {
    return new TrainingEvent(dto);
  }
}
