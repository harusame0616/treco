import { ActivityFullId } from '@Domains/activity/activity';
import { ParameterError } from '@Errors/parameter-error';
import { FSActivityQuery } from '@Queries/fs-activity-query';
import { ActivityQueryUsecase } from '@Usecases/activity-query-usecase';
import useSWR from 'swr';

const activityQueryUsecase = new ActivityQueryUsecase({
  activityQuery: new FSActivityQuery(),
});

const useActivity = (prop: Partial<ActivityFullId>) => {
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

  if (error) {
    return {
      isLoading: false as const,
      isError: true as const,
      error,
    };
  }

  if (data === undefined && !error) {
    return {
      isLoading: true as const,
      isError: false as const,
    };
  }

  return {
    isLoading: false as const,
    isError: false as const,
    activity: data ?? null,
  };
};

export default useActivity;
