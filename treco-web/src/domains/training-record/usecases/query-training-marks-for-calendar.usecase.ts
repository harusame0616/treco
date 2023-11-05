import { TrainingRecordQuery } from './training-record.query';

type Props = {
  end: Date;
  start: Date;
  traineeId: string;
};

export class TrainingRecordQueryTrainingMarksForCalendar {
  constructor(private trainingRecordQuery: TrainingRecordQuery) {}

  execute({ end, start, traineeId }: Props) {
    return this.trainingRecordQuery.queryTrainingMarksForCalendar({
      end,
      start,
      traineeId,
    });
  }
}
