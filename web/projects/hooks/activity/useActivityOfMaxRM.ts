import { ActivityFullId } from '@Domains/activity/activity';
import { RequireError } from '@Errors/require-error';
import { FSActivityQuery } from '@Queries/fs-activity-query';
import { ActivityQueryUsecase } from '@Usecases/activity-query-usecase';
import useSWR from 'swr';

const activityQueryUsecase = new ActivityQueryUsecase({
  activityQuery: new FSActivityQuery(),
});

const fecher = (_: string, userId: string, trainingEventId: string) => {
  if (!userId) {
    throw new RequireError('ユーザーID');
  }

  return activityQueryUsecase.queryDetailOfmaxRM({ userId, trainingEventId });
};

const useActivityOfMaxRM = (
  prop: Partial<Omit<ActivityFullId, 'activityId'>>
) => {
  const { data, error } = useSWR(
    ['activity/queryDetailOfmaxRM', prop.userId, prop.trainingEventId],
    fecher
  );

  if (data === undefined && !error) {
    return {
      isLoading: true as const,
      isError: false as const,
      activity: null,
    };
  }

  if (error) {
    return {
      isLoading: false as const,
      isError: true as const,
      activity: null,
      error,
    };
  }

  return {
    isLoading: false as const,
    isError: false as const,
    activity: data ?? null,
  };
};

export default useActivityOfMaxRM;
