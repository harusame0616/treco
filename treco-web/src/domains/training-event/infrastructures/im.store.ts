import { traineeFixtures } from "../../../../fixtures/trainee.fixture";
import { trainingCategoryFixtures } from "../../../../fixtures/training-category.fixture";
import { createTrainingEventFixtures } from "../../../../fixtures/training-event.fixture";
import { TrainingEventDto } from "../models/training-event";

declare global {
  // eslint-disable-next-line no-var
  var trainingEventStore: Map<string, TrainingEventDto> | undefined;
}

global.trainingEventStore =
  global.trainingEventStore ||
  new Map<string, TrainingEventDto>(
    createTrainingEventFixtures(
      trainingCategoryFixtures,
      traineeFixtures[0].traineeId,
    ).map((trainingEvent) => [trainingEvent.trainingEventId, trainingEvent]),
  );

export const trainingEventStore = global.trainingEventStore;
