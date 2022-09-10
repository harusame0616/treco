import {
  TrainingMenu,
  TrainingMenuDto,
  TrainingMenuFullId,
} from '@Domains/training-menu/training-menu';
import { TrainingMenuCollection } from '@Domains/training-menu/training-menu-collection';
import { NotFoundError } from '@Errors/not-found-error';

export interface TrainingMenuCollectionRepository {
  findByUserId(prop: { userId: string }): Promise<TrainingMenuCollection>;
  save(trainingMenuCollection: TrainingMenuCollection): Promise<void>;
}

export class TrainingMenuCollectionCommandUsecase {
  constructor(
    private prop: {
      trainingMenuCollectionRepository: TrainingMenuCollectionRepository;
    }
  ) {}

  async addTrainingMenu(prop: Omit<TrainingMenuDto, 'trainingMenuId'>) {
    const trainingMenuCollection =
      await this.prop.trainingMenuCollectionRepository.findByUserId(prop);

    trainingMenuCollection.addTrainingMenu(TrainingMenu.create(prop));
    this.prop.trainingMenuCollectionRepository.save(trainingMenuCollection);
  }

  async editTrainingMenu(prop: TrainingMenuDto) {
    const trainingMenuCollection =
      await this.prop.trainingMenuCollectionRepository.findByUserId(prop);

    trainingMenuCollection.editTrainingMenu(prop);
    this.prop.trainingMenuCollectionRepository.save(trainingMenuCollection);
  }

  async deleteTrainingMenu(prop: TrainingMenuFullId) {
    const trainingMenuCollection =
      await this.prop.trainingMenuCollectionRepository.findByUserId(prop);

    trainingMenuCollection.deleteTrainingMenu(prop);

    await this.prop.trainingMenuCollectionRepository.save(
      trainingMenuCollection
    );
  }

  async editTrainingMenuTrainingEvents(
    prop: TrainingMenuFullId & { trainingEventIds: string[] }
  ) {
    const trainingMenuCollection =
      await this.prop.trainingMenuCollectionRepository.findByUserId(prop);

    if (!trainingMenuCollection) {
      throw new NotFoundError('トレーニングメニューコレクション');
    }

    trainingMenuCollection.editTrainingMenuTrainingEvents(prop);
    await this.prop.trainingMenuCollectionRepository.save(
      trainingMenuCollection
    );
  }
}
