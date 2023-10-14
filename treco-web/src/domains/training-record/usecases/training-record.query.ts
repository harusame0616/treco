import { TrainingCategoryDto } from '@/domains/training-category/models/training-cateogry';
import { TrainingRecordDto } from '../models/training-record';
import { TrainingEventDto } from '@/domains/training-event/models/training-event';
import { TrainingCategory } from '@prisma/client';

export interface TrainingRecordQuery {
  queryOneForRecordEdit(recordId: string): Promise<
    TrainingRecordDto & {
      trainingEvent: TrainingEventDto;
      trainingCategory: TrainingCategoryDto;
    }
  >;

  queryTrainingRecordForHome(
    traineeId: string,
    date: Date
  ): Promise<
    (TrainingRecordDto & {
      trainingEvent: TrainingEventDto;
      trainingCategory: TrainingCategoryDto;
    })[]
  >;
}
