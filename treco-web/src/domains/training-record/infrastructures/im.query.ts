import { trainingCategoryFixtures } from '../../../../fixtures/training-category.fixture';
import { trainingEventFixtures } from '../../../../fixtures/training-event.fixture';
import { TrainingRecord, TrainingRecordDto } from '../models/training-record';
import { trainingRecordStore } from './im.store';
import { trainingCategoryStore } from '../../training-category/infrastructures/im.store';
import { trainingEventStore } from '../../training-event/infrastructures/im.store';
import dayjs from 'dayjs';

export class IMTrainingRecordQuery {
  constructor() {
    if (trainingRecordStore === undefined) {
      throw new Error('global.trainingRecordStore is undefined');
    }
  }

  async queryTrainingRecordForHome(traineeId: string, date: Date) {
    const dtos = Array.from(trainingRecordStore.values())
      .filter(
        (record) =>
          record.traineeId === traineeId &&
          dayjs(record.trainingDate).isSame(date, 'day')
      )
      .map((dto) => {
        const trainingEvent = Array.from(trainingEventStore.values()).find(
          (event) => event.trainingEventId === dto.trainingEventId
        );
        if (!trainingEvent) {
          throw new Error('event not found');
        }

        const trainingCategory = Array.from(
          trainingCategoryStore.values()
        ).find(
          (category) =>
            category.trainingCategoryId === trainingEvent.trainingCategoryId
        );
        if (!trainingCategory) {
          throw new Error('category not found');
        }

        return {
          ...dto,
          trainingCategory,
          trainingEvent,
        };
      });

    return dtos;
  }
}
