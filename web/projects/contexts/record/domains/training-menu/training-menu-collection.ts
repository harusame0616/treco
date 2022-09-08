import { ConflictError } from '@Errors/conflict-error';
import { NotFoundError } from '@Errors/not-found-error';
import {
  TrainingMenu,
  TrainingMenuDto,
  TrainingMenuFullId,
} from './training-menu';

export interface TrainingMenuCollectionDto {
  userId: string;
  trainingMenus: TrainingMenuDto[];
}

interface TrainingMenuConstructorProp {
  userId: string;
  trainingMenus: TrainingMenu[];
}

export class TrainingMenuCollection {
  static readonly TRAINING_MENUS_MAX_LENGTH = 4;
  constructor(private prop: TrainingMenuConstructorProp) {}

  get userId() {
    return this.prop.userId;
  }

  addTrainingMenu(trainingMenu: TrainingMenu) {
    if (
      this.prop.trainingMenus.length >=
      TrainingMenuCollection.TRAINING_MENUS_MAX_LENGTH
    ) {
      throw new ConflictError(
        'トレーニングメニューの最大登録数を超えています。'
      );
    }
    if (
      this.prop.trainingMenus
        .map((trainingMenu) => trainingMenu.name)
        .includes(trainingMenu.name)
    ) {
      throw new ConflictError('登録済みのトレーニングメニュー名です。');
    }
    this.prop.trainingMenus.push(trainingMenu);
  }

  editTrainingMenu(prop: TrainingMenuDto) {
    const editTarget = this.prop.trainingMenus.find(
      (trainingMenu) => trainingMenu.trainingMenuId == prop.trainingMenuId
    );

    if (!editTarget) {
      throw new NotFoundError('トレーニングメニューが見つかりませんでした。');
    }

    editTarget.changeName(prop.name);
    editTarget.changeNote(prop.note);
  }

  deleteTrainingMenu(prop: TrainingMenuFullId) {
    const index = this.prop.trainingMenus.findIndex(
      (trainingMenu) => trainingMenu.trainingMenuId == prop.trainingMenuId
    );

    if (index < 0) {
      throw new NotFoundError('トレーニングメニューが見つかりませんでした。');
    }

    this.prop.trainingMenus.splice(index, 1);
  }

  static fromDto(dto: TrainingMenuCollectionDto): TrainingMenuCollection {
    return new TrainingMenuCollection({
      userId: dto.userId,
      trainingMenus:
        dto.trainingMenus?.map?.((trainingMenu) =>
          TrainingMenu.fromDto(trainingMenu)
        ) ?? [],
    });
  }

  toDto(): TrainingMenuCollectionDto {
    return {
      userId: this.prop.userId,
      trainingMenus: this.prop.trainingMenus.map((menu) => menu.toDto()),
    };
  }
}
