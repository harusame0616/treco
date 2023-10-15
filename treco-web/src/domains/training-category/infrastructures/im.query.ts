import { trainingCategoryStore } from './im.store';

export class IMTrainingCategoryQuery {
  constructor() {}

  async queryListByTraineeId(traineeId: string) {
    return Array.from(trainingCategoryStore.values()).filter(
      (category) => category.traineeId === traineeId,
    );
  }
}
