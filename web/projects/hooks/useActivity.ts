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
  activity: ActivityWithCategoryAndTrainingEventDto | null;
}

const activityQueryUsecase = new ActivityQueryUsecase({
  activityQuery: new FSActivityQuery(),
});

const useActivity = (prop: {
  userId?: string;
  categoryId?: string;
  trainingEventId?: string;
  activityId?: string;
}): UseActivitiesReturnType => {
  const { data, error } = useSWR(
    [
      'activity/queryDetail',
      prop.userId,
      prop.categoryId,
      prop.trainingEventId,
      prop.activityId,
    ],
    (
      _: string,
      userId: string,
      categoryId: string,
      trainingEventId: string,
      activityId: string
    ) => {
      if (!userId || !activityId || !categoryId || !trainingEventId) {
        throw new ParameterError(
          'ユーザーID、カテゴリID、アクティビティIDは必須です。'
        );
      }
      return activityQueryUsecase.queryDetail({
        userId,
        categoryId,
        trainingEventId,
        activityId,
      });
    }
  );

  return {
    isLoading: !data && !error,
    isError: error,
    activity: data ?? null,
  };
};
export default useActivity;
