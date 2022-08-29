import useSWR from 'swr';
import { FSActivityQuery } from '../contexts/record/infrastructure/query/fs-activity-query';
import {
  ActivityQueryUsecase,
  ActivityWithCategoryAndTrainingEventDto,
} from '../contexts/record/usecases/activity-query-usecase';
import { ParameterError } from '../custom-error/parameter-error';

interface UseActivitiesReturnType {
  isError: boolean;
  isLoading: boolean;
  activities: ActivityWithCategoryAndTrainingEventDto[];
}

const activityQueryUsecase = new ActivityQueryUsecase({
  activityQuery: new FSActivityQuery(),
});

const useActivities = (prop: {
  userId?: string;
  month?: Date;
}): UseActivitiesReturnType => {
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
