import {
  Activity,
  ActivityDto,
  ActivityRecord,
} from '@Domains/activity/activity';
import { ParameterError } from '@Errors/parameter-error';
import useTrainingEvent from '@Hooks/training-event/useTrainingEvent';
import { FSActivityRepository } from '@Repositories/fs-activity-repository';
import { FSCategoryRepository } from '@Repositories/fs-category-repository';
import { FSTrainigEventRepository } from '@Repositories/fs-training-event-repository';
import { ActivityCommandUsecase } from '@Usecases/activity-command-usecase';
import { useEffect, useState } from 'react';
import useActivity from './useActivity';

// ---------- types ----------
type UseActivityEditProp = Partial<Omit<ActivityDto, 'records'>>;
export interface ActivityRecordWork {
  id: any;
  load: '' | number;
  value: '' | number;
  note: string;
}

const DEFAULT_RECORD_COUNT = 10;
const EMPTY_RECORD: Omit<ActivityRecordWork, 'id'> = {
  load: '',
  value: '',
  note: '',
};

// ---------- functions ----------
const generateEmptyRecords = () =>
  Array(DEFAULT_RECORD_COUNT)
    .fill(0)
    .map((_) => ({ ...EMPTY_RECORD, id: Math.random() } as ActivityRecordWork));

const activityCommandUsecase = new ActivityCommandUsecase({
  activityRepository: new FSActivityRepository(),
  categoryRepository: new FSCategoryRepository(),
  trainingEventRepository: new FSTrainigEventRepository(),
});

// ---------- custom hook ----------
const useActivityEdit = (prop: UseActivityEditProp) => {
  const { isLoading, trainingEvent, isError } = useTrainingEvent(prop);
  const [errorRecordIndex, setErrorRecordIndex] = useState<null | number>(null);

  const {
    activity,
    isError: activityIsError,
    isLoading: activityIsLoading,
  } = useActivity(prop);

  const [records, setRecords] = useState<ActivityRecordWork[]>(
    activityIsLoading
      ? []
      : activity?.records.map((record) => ({ ...record, id: Math.random() })) ??
          []
  );

  useEffect(() => {
    if (activityIsLoading) {
      return;
    }

    setRecords(
      activity?.records?.map((record) => ({ id: Math.random(), ...record })) ??
        generateEmptyRecords()
    );
  }, [activityIsLoading]);

  const addNewRecord = () => {
    setRecords([...records, { ...EMPTY_RECORD, id: Math.random() }]);
  };

  const setRecord = (record: ActivityRecordWork, index: number) => {
    const workRecords = [...records];
    workRecords.splice(index, 1, record);
    setRecords([...workRecords]);
  };

  const deleteRecord = (index: number) => {
    const workRecords = [...records];
    workRecords.splice(index, 1);
    setRecords([...workRecords]);
  };

  const register = async () => {
    setErrorRecordIndex(null);
    if (!prop.userId || !prop.categoryId || !prop.trainingEventId) {
      throw new ParameterError('?????????????????????????????????');
    }

    // ??????????????????????????????????????????????????????????????????
    const lastRecordedIndex = records.reduce(
      (lastRecordedIndex, record, currentIndex) => {
        return record.load != '' || record.value != '' || record.note.length
          ? currentIndex
          : lastRecordedIndex;
      },
      -1
    );

    // ????????????????????????????????????
    if (lastRecordedIndex < 0) {
      setErrorRecordIndex(0);
      throw new ParameterError('1??????????????????????????????????????????');
    }

    // ??????????????????????????????????????????
    const workRecords = [...records];
    if (lastRecordedIndex != records.length) {
      workRecords.splice(
        lastRecordedIndex + 1,
        records.length - lastRecordedIndex
      );
    }

    // ???????????????????????????
    const errorIndex = workRecords.findIndex(
      (record) =>
        record.load === '' ||
        record.value === '' ||
        record.note.length > Activity.RECORD_NOTE_MAX_LENGTH
    );

    if (errorIndex >= 0) {
      setErrorRecordIndex(errorIndex);
      throw new ParameterError('???????????????????????????');
    }

    const activitySearchParam = {
      userId: prop.userId,
      categoryId: prop.categoryId,
      trainingEventId: prop.trainingEventId,
    };

    let activityId = await (async () => {
      if (typeof prop.activityId === 'string') {
        return prop.activityId;
      }

      if (!prop.date) {
        throw new ParameterError('????????????????????????');
      }

      return (
        await activityCommandUsecase.createNewActivity({
          ...activitySearchParam,
          date: prop.date,
        })
      ).activityId;
    })();

    await activityCommandUsecase.updateActivityRecord({
      ...activitySearchParam,
      activityId: activityId,
      records: workRecords as ActivityRecord[],
    });
  };

  if (isLoading || activityIsLoading) {
    return {
      isLoading: true as const,
      isError: false as const,
    };
  }

  if (
    isError ||
    (prop.activityId != null && activityIsError) ||
    trainingEvent == null
  ) {
    return {
      isLoading: false as const,
      isError: true as const,
      error: isError || activityIsError,
    };
  }

  return {
    isLoading: false as const,
    isError: false as const,
    trainingEvent,
    records,
    addNewRecord,
    setRecord,
    deleteRecord,
    register,
    errorRecordIndex,
  };
};

export default useActivityEdit;
