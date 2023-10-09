import { createTrainingCategoryFixtures } from '../../../../fixtures/training-category.fixture';
import { traineeFixtures } from '../../../../fixtures/trainee.fixture';
import { TrainingCategoryDto } from '../models/training-cateogry';

declare global {
  var trainingCategoryStore: Map<string, TrainingCategoryDto> | undefined;
}

global.trainingCategoryStore =
  global.trainingCategoryStore ||
  new Map<string, TrainingCategoryDto>(
    createTrainingCategoryFixtures(traineeFixtures[0].traineeId).map(
      (category) => [category.trainingCategoryId, category]
    )
  );

export class IMTrainingCategoryQuery {
  trainingCategoryStore;
  constructor() {
    if (global.trainingCategoryStore === undefined) {
      throw new Error('global.trainingCategoryStore is undefined');
    }

    this.trainingCategoryStore = global.trainingCategoryStore;
  }

  async queryListByTraineeId(traineeId: string) {
    return Array.from(this.trainingCategoryStore.values()).filter(
      (category) => category.traineeId === traineeId
    );
  }
}
