import { generateId } from '@/lib/id';
import { TrainingCategoryDto } from '../models/training-cateogry';
import { traineeFixtures } from '../../../../fixtures/trainee.fixture';

declare global {
  var trainingCategoryStore: Map<string, TrainingCategoryDto> | undefined;
}

global.trainingCategoryStore =
  global.trainingCategoryStore ||
  new Map<string, TrainingCategoryDto>(
    [
      {
        trainingCategoryId: generateId(),
        name: '胸',
        color: '#db4d6d',
        traineeId: traineeFixtures[0].id,
        order: 0,
      },
      {
        trainingCategoryId: generateId(),
        name: '背中',
        color: '#86c166',
        traineeId: traineeFixtures[0].id,
        order: 1,
      },
      {
        trainingCategoryId: generateId(),
        name: '脚',
        color: '#f596aa',
        traineeId: traineeFixtures[0].id,
        order: 2,
      },
      {
        trainingCategoryId: generateId(),
        name: '肩',
        color: '#caad5f',
        traineeId: traineeFixtures[0].id,
        order: 3,
      },
      {
        trainingCategoryId: generateId(),
        name: '腕',
        color: '#fcfaf2',
        traineeId: traineeFixtures[0].id,
        order: 4,
      },
    ].map((category) => [category.trainingCategoryId, category])
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
    console.log({
      traineeId,
      values: Array.from(this.trainingCategoryStore.values()),
    });
    return Array.from(this.trainingCategoryStore.values()).filter(
      (category) => category.traineeId === traineeId
    );
  }
}
