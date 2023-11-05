import { TrainingRecordQuery } from './training-record.query';

type Props = {
  date: Date;
  traineeId: string;
};

export class TrainingRecordQueryTrainingMarksPerMonthForCalendar {
  constructor(private trainingRecordQuery: TrainingRecordQuery) {}

  execute({ date, traineeId }: Props) {
    return this.trainingRecordQuery.queryTrainingMarksPerMonthForCalendar({
      date,
      traineeId,
    });
  }
}
