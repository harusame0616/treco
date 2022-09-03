import { ActivityFullId } from '@Domains/activity/activity';
import { ParameterError } from '@Errors/parameter-error';
import { FSActivityQuery } from '@Queries/fs-activity-query';
import { ActivityQueryUsecase } from '@Usecases/activity-query-usecase';
import useSWR from 'swr';

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

const useActivityOfLastTrainingEvent = (
  prop: Partial<Omit<ActivityFullId, 'activityId'>>
) => {
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
