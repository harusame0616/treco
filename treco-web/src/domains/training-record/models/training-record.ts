import { generateId } from '@/lib/id';

export type TrainingSet = {
  load: number;
  note: string;
  value: number;
};

export type TrainingRecordDto = {
  sets: TrainingSet[];
  traineeId: string;
  trainingDate: Date;
  trainingEventId: string;
  trainingRecordId: string;
};

export class TrainingRecord {
  private constructor(private dto: TrainingRecordDto) {}

  static create({
    traineeId,
    trainingDate,
    trainingEventId,
  }: {
    traineeId: string;
    trainingDate: Date;
    trainingEventId: string;
  }) {
    return new TrainingRecord({
      sets: [],
      traineeId,
      trainingDate,
      trainingEventId,
      trainingRecordId: generateId(),
    });
  }

  static fromDto(dto: TrainingRecordDto) {
    return new TrainingRecord(dto);
  }

  addSet({ load, note, value }: TrainingSet) {
    this.dto.sets.push({ load, note, value });
  }

  editSet({ index, load, note, value }: TrainingSet & { index: number }) {
    if (this.dto.sets.length <= index) {
      console.error('edit set index is out ouf range', {
        index,
        setLength: this.dto.sets.length,
      });
      throw new Error('edit set index is out of range', {});
    }

    this.dto.sets.splice(index, 1, { load, note, value });
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
}
