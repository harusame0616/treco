import { traineeFixtures } from '../../../../fixtures/trainee.fixture';
import { createTrainingCategoryFixtures } from '../../../../fixtures/training-category.fixture';
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

export const trainingCategoryStore = global.trainingCategoryStore;
