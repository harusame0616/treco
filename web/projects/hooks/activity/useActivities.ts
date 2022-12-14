import { RequireError } from '@Errors/require-error';
import { FSActivityQuery } from '@Queries/fs-activity-query';
import { ActivityQueryUsecase } from '@Usecases/activity-query-usecase';
import useSWR from 'swr';

const activityQueryUsecase = new ActivityQueryUsecase({
  activityQuery: new FSActivityQuery(),
});

const useActivities = (prop: {
  userId?: string;
  month?: Date;
  date?: Date;
}) => {
  const { data, error, mutate } = useSWR(
    ['activity/queryList', prop.userId, prop.month, prop.date],
    (_: string, userId: string, month: Date, date: Date) => {
      if (!userId) {
        throw new RequireError('ユーザーID');
      }

      if (prop.month) {
        return activityQueryUsecase.queryListInMonth({ userId, month });
      }
      if (prop.date) {
        return activityQueryUsecase.queryListOnDate({ userId, date });
      }

      throw new RequireError('月、日付のどちらか');
    }
  );

  if (!data && !error) {
    return {
      isLoading: true as const,
      isError: false as const,
      activities: null,
    };
  }

  if (error) {
    return {
      isLoading: false as const,
      isError: true as const,
      error,
      activities: null,
    };
  }

  return {
    isLoading: false as const,
    isError: false as const,
    activities: data ?? [],
    async refresh() {
      await mutate();
    },
  };
};

export default useActivities;
