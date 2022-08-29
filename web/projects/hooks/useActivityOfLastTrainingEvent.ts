import useSWR from 'swr';
import { FSActivityQuery } from '../contexts/record/infrastructure/query/fs-activity-query';
import { ActivityQueryUsecase } from '../contexts/record/usecases/activity-query-usecase';
import { ParameterError } from '../custom-error/parameter-error';

interface Prop {
  userId: string;
  categoryId: string;
  trainingEventId: string;
}

const activityQueryUsecase = new ActivityQueryUsecase({
  activityQuery: new FSActivityQuery(),
});

const fecher = (
  _: string,
  userId: string,
  categoryId: string,
  trainingEventId: string
) => {
  if (!userId || !categoryId || !trainingEventId) {
    throw new ParameterError('パラメーターが不足しています。');
  }
  return activityQueryUsecase.queryDetailOfLastTrainingEvent({
    userId,
    categoryId,
    trainingEventId,
  });
};

const useActivityOfLastTrainingEvent = (prop: Partial<Prop>) => {
  const { data, error } = useSWR(
    [
      'activity/queryDetailOfLastTrainingEvent',
      prop.userId,
      prop.categoryId,
      prop.trainingEventId,
    ],
    fecher
  );

  return {
    isLoading: !data && !error,
    isError: !data && error,
    activity: data ?? null,
  };
};

export default useActivityOfLastTrainingEvent;
