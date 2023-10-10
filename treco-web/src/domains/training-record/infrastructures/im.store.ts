import { TrainingRecordDto } from '../models/training-record';

declare global {
  var trainingRecordStore: Map<string, TrainingRecordDto> | undefined;
}

global.trainingRecordStore =
  global.trainingRecordStore || new Map<string, TrainingRecordDto>();

export const trainingRecordStore = global.trainingRecordStore;
