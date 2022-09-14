import { ParameterError } from '@Errors/parameter-error';
import { generateId, isId, isUserId } from '@/utils/id';
import { NegativeNumberError } from '@Errors/negative-number-error';

export interface ActivityRecord {
  load: number;
  value: number;
  note: string;
}

export interface ActivityFullId {
  userId: string;
  categoryId: string;
  trainingEventId: string;
  activityId: string;
}

export interface ActivityProperty {
  records: ActivityRecord[];
  date: Date;
  createdAt?: Date;
}

export type ActivityDto = ActivityFullId & ActivityProperty;
export type CreateProp = Omit<
  ActivityDto,
  'activityId' | 'records' | 'createdAt'
>;
export const isCreateProp = (value: any): value is CreateProp => {
  return (
    typeof value.userId === 'string' &&
    typeof value.categoryId === 'string' &&
    typeof value.trainingEventId === 'string' &&
    value.date instanceof Date
  );
};

export class Activity {
  static readonly RECORD_NOTE_MAX_LENGTH = 1024;
  static readonly RECORDS_MAX_LENGTH = 30;

  constructor(private prop: ActivityDto) {}

  static create(prop: CreateProp) {
    [
      [prop.categoryId, 'カテゴリID'],
      [prop.trainingEventId, 'トレーニング種目ID'],
    ].forEach(([id, name]) => {
      if (!isId(id)) {
        throw new ParameterError(`${name}が不正です。`);
      }
    });

    if (!isUserId(prop.userId)) {
      throw new ParameterError(`ユーザーIDが不正です。`);
    }

    if (Number.isNaN(prop.date.getTime())) {
      throw new ParameterError('日付が不正です。');
    }

    return new Activity({ ...prop, activityId: generateId(), records: [] });
  }

  updateRecords(records: ActivityRecord[]) {
    if (!records.length) {
      throw new ParameterError(`レコードは必須です。`);
    }

    if (records.length > Activity.RECORDS_MAX_LENGTH) {
      throw new ParameterError(
        `レコードは最大${Activity.RECORDS_MAX_LENGTH}レコードまでです。`
      );
    }

    records.forEach((record) => {
      if (record.load < 0) {
        throw new NegativeNumberError('負荷');
      }

      if (record.value < 0) {
        throw new NegativeNumberError('値');
      }

      if (record.note.length > Activity.RECORD_NOTE_MAX_LENGTH) {
        throw new ParameterError(
          `備考は最大${Activity.RECORD_NOTE_MAX_LENGTH}文字です。`
        );
      }
    });

    this.prop.records = records;
  }

  toDto(): ActivityDto {
    return {
      userId: this.prop.userId,
      categoryId: this.prop.categoryId,
      trainingEventId: this.prop.trainingEventId,
      activityId: this.prop.activityId,
      records: this.prop.records.map(({ load, value, note }) => ({
        load,
        value,
        note,
      })),
      date: this.prop.date,
      createdAt: this.prop.createdAt,
    };
  }

  static fromDto(activityDto: ActivityDto) {
    return new Activity(activityDto);
  }
}
