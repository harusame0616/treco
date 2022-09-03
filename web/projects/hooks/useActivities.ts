import { FSActivityQuery } from '@Queries/fs-activity-query';
import { ParameterError } from '@Errors/parameter-error';
import { ActivityQueryUsecase } from '@Usecases/activity-query-usecase';
import useSWR from 'swr';

const activityQueryUsecase = new ActivityQueryUsecase({
  activityQuery: new FSActivityQuery(),
});

const useActivities = (prop: { userId?: string; month?: Date }) => {
  const { data, error } = useSWR(
    ['activity/queryListInMonth', prop.userId, prop.month],
    (_: string, userId: string, month: Date) => {
      if (!userId || !month) {
        throw new ParameterError('userId and month is required.');
      }
      return activityQueryUsecase.queryListInMonth({ userId, month });
    }
  );

  return {
    isLoading: !prop.userId || !prop.month || (!data && !error),
    isError: prop.userId && prop.month && error,
    activities: data ?? [],
  };
};
export default useActivities;
