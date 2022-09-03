import { FSActivityQuery } from '@Queries/fs-activity-query';
import { ActivityFullId } from '@Domains/activity/activity';
import { ParameterError } from '@Errors/parameter-error';
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

  return {
    isLoading: !data && !error,
    isError: error,
    activity: data ?? null,
  };
};
export default useActivity;
