import { ParameterError } from '../../../../custom-error/parameter-error';
import { generateId } from '../../../../utils/id';

export interface ActivityRecord {
  load: number;
  value: number;
  note: string;
}

interface ConstructorProp {
  userId: string;
  categoryId: string;
  trainingEventId: string;
  activityId: string;
  records: ActivityRecord[];
  date: Date;
}

export type ActivityDto = ReturnType<Activity['toDto']>;

export class Activity {
  static readonly RECORD_NOTE_MAX_LENGTH = 1024;
  constructor(private prop: ConstructorProp) {}

  static create(prop: {
    userId: string;
    categoryId: string;
    trainingEventId: string;
    date: Date;
  }) {
    return new Activity({
      userId: prop.userId,
      categoryId: prop.categoryId,
      trainingEventId: prop.trainingEventId,
      activityId: generateId(),
      records: [],
      date: prop.date,
    });
  }

  updateRecords(records: ActivityRecord[]) {
    records.forEach((record) => {
      if (
        typeof record.load != 'number' ||
        typeof record.value != 'number' ||
        typeof record.note != 'string' ||
        record.note.length > Activity.RECORD_NOTE_MAX_LENGTH
      ) {
        throw new ParameterError('ActivityRecordのパラメーターが不正です。', {
          records,
          record,
        });
      }
    });

    this.prop.records = records;
  }

  toDto() {
    return {
      userId: this.prop.userId,
      categoryId: this.prop.categoryId,
      trainingEventId: this.prop.trainingEventId,
      activityId: this.prop.activityId,
      records: this.prop.records,
      date: this.prop.date,
    };
  }

  static fromDto(activityDto: ActivityDto) {
    return new Activity(activityDto);
  }
}
