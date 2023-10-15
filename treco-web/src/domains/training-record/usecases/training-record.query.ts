import { TrainingCategoryDto } from "@/domains/training-category/models/training-cateogry";
import { TrainingEventDto } from "@/domains/training-event/models/training-event";

import { TrainingRecordDto } from "../models/training-record";

export interface TrainingRecordQuery {
  queryOneForRecordEdit(recordId: string): Promise<
    TrainingRecordDto & {
      trainingCategory: TrainingCategoryDto;
      trainingEvent: TrainingEventDto;
    }
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
