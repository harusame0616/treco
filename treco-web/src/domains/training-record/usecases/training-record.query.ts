import { TrainingCategoryDto } from '@/domains/training-category/models/training-category';
import { TrainingEventDto } from '@/domains/training-event/models/training-event';

import { TrainingRecordDto } from '../models/training-record';

export interface TrainingRecordQuery {
  queryOneForRecordEdit(recordId: string): Promise<
    TrainingRecordDto & {
      trainingCategory: TrainingCategoryDto;
      trainingEvent: TrainingEventDto;
    }
  >;

  queryTrainingMarksForCalendar(props: {
    end: Date;
    start: Date;
    traineeId: string;
  }): Promise<
    {
      color: string;
      trainingCategoryId: string;
      trainingDate: Date;
      trainingRecordId: string;
    }[]
  >;

  queryTrainingRecordForHome(
    traineeId: string,
    date: Date,
  ): Promise<
    (TrainingRecordDto & {
      trainingCategory: TrainingCategoryDto;
      trainingEvent: TrainingEventDto;
    })[]
  >;
}
