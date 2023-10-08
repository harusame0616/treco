import { generateId } from '@/lib/id';

export type TrainingRecordDto = {
  trainingRecordId: string;
  trainingEventId: string;
  recordedAt: Date;
  records: {
    id: string;
  }[];
};

export class TrainingRecord {
  private constructor(private dto: TrainingRecordDto) {}

  static create({ trainingEventId }: { trainingEventId: string }) {
    return new TrainingRecord({
      trainingRecordId: generateId(),
      trainingEventId,
      recordedAt: new Date(),
      records: [],
    });
  }

  toDto() {
    return {
      ...this.dto,
      records: [...this.dto.records],
    };
  }
}
