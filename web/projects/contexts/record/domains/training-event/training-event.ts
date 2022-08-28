import { ParameterError } from '../../../../custom-error/parameter-error';
import { generateId } from '../../../../utils/id';

export interface TrainingEventDto {
  userId: string;
  categoryId: string;
  trainingEventId: string;
  trainingEventName: string;
  loadUnit: string;
  valueUnit: string;
  order: number;
}

export type ConstructorProp = TrainingEventDto;
export type TrainingEventCreateProp = Omit<ConstructorProp, 'trainingEventId'>;

export class TrainingEvent {
  static readonly TRAINING_EVENT_NAME_MAX_LENGTH = 24;
  static readonly LOAD_UNIT_MAX_LENGTH = 8;
  static readonly VALUE_UNIT_MAX_LENGTH = 8;

  constructor(private prop: ConstructorProp) {
    if (!prop.userId?.length) {
      throw new ParameterError('ユーザーIDは必須です。');
    }
    if (!prop.categoryId?.length) {
      throw new ParameterError('カテゴリIDは必須です。');
    }
    this.changeLoadUnit(prop.loadUnit);
    this.changeValueUnit(prop.valueUnit);
    this.changeTrainingEventName(prop.trainingEventName);
  }

  static create(prop: TrainingEventCreateProp): TrainingEvent {
    return new TrainingEvent({ ...prop, trainingEventId: generateId() });
  }

  toDto(): TrainingEventDto {
    return {
      userId: this.prop.userId,
      categoryId: this.prop.categoryId,
      trainingEventId: this.prop.trainingEventId,
      trainingEventName: this.prop.trainingEventName,
      loadUnit: this.prop.loadUnit,
      valueUnit: this.prop.valueUnit,
      order: this.prop.order,
    };
  }

  static fromDto(dto: TrainingEventDto): TrainingEvent {
    return new TrainingEvent(dto);
  }

  get trainingEventName() {
    return this.prop.trainingEventName;
  }

  get order() {
    return this.prop.order;
  }

  changeTrainingEventName(newTrainingEventName: string) {
    if (!newTrainingEventName?.length) {
      throw new ParameterError('トレーニング種目名は必須です。');
    }

    if (
      this.trainingEventName.length >
      TrainingEvent.TRAINING_EVENT_NAME_MAX_LENGTH
    ) {
      throw new ParameterError(
        `トレーニング種目名は${TrainingEvent.TRAINING_EVENT_NAME_MAX_LENGTH}以下で入力してください。`
      );
    }

    this.prop.trainingEventName = newTrainingEventName;
  }

  changeLoadUnit(newLoadUnit: string) {
    if (!newLoadUnit?.length) {
      throw new ParameterError('負荷単位は必須です。');
    }

    if (newLoadUnit.length > TrainingEvent.LOAD_UNIT_MAX_LENGTH) {
      throw new ParameterError(
        `負荷単位は${TrainingEvent.LOAD_UNIT_MAX_LENGTH}以下で入力してください。`
      );
    }

    this.prop.loadUnit = newLoadUnit;
  }
  changeValueUnit(newValueUnit: string) {
    if (!newValueUnit?.length) {
      throw new ParameterError('値単位は必須です。');
    }

    if (newValueUnit.length > TrainingEvent.VALUE_UNIT_MAX_LENGTH) {
      throw new ParameterError(
        `値単位は${TrainingEvent.LOAD_UNIT_MAX_LENGTH}以下で入力してください。`
      );
    }

    this.prop.valueUnit = newValueUnit;
  }
}
