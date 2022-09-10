import { OverflowError } from '@Errors/overflow-error';
import { RequireError } from '@Errors/require-error';
import { TextOverflowError } from '@Errors/text-overflow-error';
import { generateId } from '../../../../utils/id';

export interface TrainingMenuFullId {
  userId: string;
  trainingMenuId: string;
}

export interface TrainingMenuProperty {
  name: string;
  note: string;
  trainingEventIds: string[];
}

export type TrainingMenuDto = TrainingMenuFullId & TrainingMenuProperty;

export type ConstructorProp = TrainingMenuDto;
export type TrainingMenuCreateProp = Omit<
  ConstructorProp,
  'trainingMenuId' | 'menus' | 'trainingEventIds'
>;

export class TrainingMenu {
  static readonly NAME_MAX = 24;
  static readonly NOTE_MAX = 1024;
  static readonly TRAINING_EVENT_LENGTH = 10;

  constructor(private prop: ConstructorProp) {}

  static create(prop: TrainingMenuCreateProp): TrainingMenu {
    const trainingMenu = new TrainingMenu({
      ...prop,
      trainingMenuId: generateId(),
      trainingEventIds: [],
    });

    trainingMenu.changeName(prop.name);
    trainingMenu.changeNote(prop.note);
    return trainingMenu;
  }

  get trainingMenuId() {
    return this.prop.trainingMenuId;
  }

  get name() {
    return this.prop.name;
  }

  changeName(name: string) {
    TrainingMenu.validateName(name);
    this.prop.name = name;
  }

  changeNote(note: string) {
    TrainingMenu.validateNote(note);
    this.prop.note = note;
  }

  changeTrainingEvents(trainingEventIds: string[]) {
    TrainingMenu.validateTrainingEvents(trainingEventIds);
    this.prop.trainingEventIds = trainingEventIds;
  }

  toDto(): TrainingMenuDto {
    return {
      userId: this.prop.userId,
      trainingMenuId: this.prop.trainingMenuId,
      name: this.prop.name,
      note: this.prop.note,
      trainingEventIds: this.prop.trainingEventIds,
    };
  }

  static fromDto(dto: TrainingMenuDto): TrainingMenu {
    return new TrainingMenu(dto);
  }

  static validateName(name: string) {
    const PARAMETER_NAME = 'トレーニングメニュー名';

    if (!name.length) {
      throw new RequireError(PARAMETER_NAME);
    }

    if (name.length > TrainingMenu.NAME_MAX) {
      throw new TextOverflowError(PARAMETER_NAME, TrainingMenu.NAME_MAX);
    }
  }

  static validateNote(note: string) {
    const PARAMETER_NAME = '備考';

    if (note.length > TrainingMenu.NOTE_MAX) {
      throw new TextOverflowError(PARAMETER_NAME, TrainingMenu.NAME_MAX);
    }
  }

  static validateTrainingEvents(trainingEventIds: string[]) {
    const PARAMETER_NAME = 'トレーニング種目';

    if (trainingEventIds.length > TrainingMenu.TRAINING_EVENT_LENGTH) {
      throw new OverflowError(
        PARAMETER_NAME,
        TrainingMenu.TRAINING_EVENT_LENGTH
      );
    }
  }
}
