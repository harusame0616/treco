import { useEffect, useState } from 'react';
import {
  Activity,
  ActivityRecord,
} from '../contexts/record/domains/activity/activity';
import { FSActivityRepository } from '../contexts/record/infrastructure/repository/fs-activity-repository';
import { ActivityCommandUsecase } from '../contexts/record/usecases/activity-command-usecase';
import { ParameterError } from '../custom-error/parameter-error';
import useActivity from './useActivity';
import useTrainingEvent from './useTrainingEvent';

interface UseActivityCreateProp {
  userId?: string;
  categoryId?: string;
  trainingEventId?: string;
  activityId?: string;
  date: Date;
}

export interface ActivityRecordWork {
  load: '' | number;
  value: '' | number;
  note: string;
}

const activityCommandUsecase = new ActivityCommandUsecase({
  activityRepository: new FSActivityRepository(),
});

const useActivityCreate = (prop: UseActivityCreateProp) => {
  const { isLoading, trainingEvent, isError } = useTrainingEvent(prop);
  const [errorRecordIndex, setErrorRecordIndex] = useState<null | number>(null);

  const {
    activity,
    isError: activityIsError,
    isLoading: activityIsLoading,
  } = useActivity(prop);

  const [records, setRecords] = useState<ActivityRecordWork[]>(
    activity?.records ?? [
      { load: '', value: '', note: '' },
      { load: '', value: '', note: '' },
      { load: '', value: '', note: '' },
    ]
  );

  useEffect(() => {
    setRecords(
      activity?.records ?? [
        { load: '', value: '', note: '' },
        { load: '', value: '', note: '' },
        { load: '', value: '', note: '' },
      ]
    );
  }, [activity]);

  const addNewRecord = () => {
    setRecords([...records, { load: '', value: '', note: '' }]);
  };

  const setRecord = (record: ActivityRecordWork, index: number) => {
    const workRecords = [...records];
    workRecords.splice(index, 1, record);
    setRecords([...workRecords]);
  };

  const register = async () => {
    setErrorRecordIndex(null);
    if (!prop.userId || !prop.categoryId || !prop.trainingEventId) {
      throw new ParameterError('パラメータが不正です。');
    }

    // 一番最後の記入済みレコードインデックスを取得
    const lastRecordedIndex = records.reduce(
      (lastRecordedIndex, record, currentIndex) => {
        return record.load != '' || record.value != '' || record.note.length
          ? currentIndex
          : lastRecordedIndex;
      },
      -1
    );

    // 入力されたレコードがない
    if (lastRecordedIndex < 0) {
      setErrorRecordIndex(0);
      throw new ParameterError('1セット以上記録してください。');
    }

    // 後ろの空レコードをトリムする
    const workRecords = [...records];
    if (lastRecordedIndex != records.length) {
      workRecords.splice(
        lastRecordedIndex + 1,
        records.length - lastRecordedIndex
      );
    }

    // 値のバリデーション
    const errorIndex = workRecords.findIndex(
      (record) =>
        record.load === '' ||
        record.value === '' ||
        record.note.length > Activity.RECORD_NOTE_MAX_LENGTH
    );

    if (errorIndex >= 0) {
      setErrorRecordIndex(errorIndex);
      throw new ParameterError('記録が不完全です。');
    }

    const activitySearchParam = {
      userId: prop.userId,
      categoryId: prop.categoryId,
      trainingEventId: prop.trainingEventId,
    };

    let activity;
    let activityId = prop.activityId;
    if (!activityId) {
      activity = await activityCommandUsecase.createNewActivity({
        ...activitySearchParam,
        date: prop.date,
      });
      activityId = activity.activityId;
    }

    await activityCommandUsecase.updateActivityRecord({
      ...activitySearchParam,
      activityId: activityId,
      records: workRecords as ActivityRecord[],
    });
  };

  return {
    isLoading: isLoading || activityIsLoading,
    isError: isError || (prop.activityId != null && activityIsError),
    trainingEvent,
    records,
    addNewRecord,
    setRecord,
    register,
    errorRecordIndex,
  };
};

export default useActivityCreate;
