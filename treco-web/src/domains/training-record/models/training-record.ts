import { generateId } from '@/lib/id';

export type TrainingSet = {
  value: number;
  load: number;
  note: string;
};

export type TrainingRecordDto = {
  trainingRecordId: string;
  trainingEventId: string;
  traineeId: string;
  recordedAt: Date;
  sets: TrainingSet[];
};

export class TrainingRecord {
  private constructor(private dto: TrainingRecordDto) {}

  addSet({ value, load, note }: TrainingSet) {
    this.dto.sets.push({ value, load, note });
  }

  static create({
    trainingEventId,
    traineeId,
  }: {
    trainingEventId: string;
    traineeId: string;
  }) {
    return new TrainingRecord({
      traineeId,
      trainingRecordId: generateId(),
      trainingEventId,
      recordedAt: new Date(),
      sets: [],
    });
  }

  isByTrainee(traineeId: string) {
    return this.dto.traineeId === traineeId;
  }

  toDto() {
    return {
      ...this.dto,
      sets: [...this.dto.sets],
    };
  }

  static fromDto(dto: TrainingRecordDto) {
    return new TrainingRecord(dto);
  }
}
