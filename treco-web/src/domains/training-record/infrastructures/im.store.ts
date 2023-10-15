import { TrainingRecordDto } from "../models/training-record";

declare global {
  // eslint-disable-next-line no-var
  var trainingRecordStore: Map<string, TrainingRecordDto> | undefined;
}

global.trainingRecordStore =
  global.trainingRecordStore || new Map<string, TrainingRecordDto>();

export const trainingRecordStore = global.trainingRecordStore;
