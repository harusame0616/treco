import { trainingEventStore } from './im.store';
export class IMTrainingEventQuery {
  constructor() {}

  async queryListByTrainingCategoryId(trainingCategoryId: string) {
    return Array.from(trainingEventStore.values()).filter(
      (event) => event.trainingCategoryId === trainingCategoryId,
    );
  }
}
