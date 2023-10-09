import { traineeFixtures } from '../../../../fixtures/trainee.fixture';
import { trainingCategoryFixtures } from '../../../../fixtures/training-category.fixture';
import { createTrainingEventFixtures } from '../../../../fixtures/training-event.fixture';
import { TrainingEventDto } from '../models/training-event';

declare global {
  var trainingEventStore: Map<string, TrainingEventDto> | undefined;
}

global.trainingEventStore =
  global.trainingEventStore ||
  new Map<string, TrainingEventDto>(
    createTrainingEventFixtures(
      trainingCategoryFixtures,
      traineeFixtures[0].traineeId
    ).map((trainingEvent) => [trainingEvent.trainingEventId, trainingEvent])
  );

export class IMTrainingEventQuery {
  trainingEventStore;
  constructor() {
    if (global.trainingEventStore === undefined) {
      throw new Error('global.trainingEventStore is undefined');
    }

    this.trainingEventStore = global.trainingEventStore;
  }

  async queryListByTrainingCategoryId(trainingCategoryId: string) {
    return Array.from(this.trainingEventStore.values()).filter(
      (event) => event.trainingCategoryId === trainingCategoryId
    );
  }
}
