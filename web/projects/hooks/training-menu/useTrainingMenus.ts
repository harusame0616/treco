import { ParameterError } from '@Errors/parameter-error';
import useActivities from '@Hooks/useActivities';
import { FSTrainingMenuCollectionQuery } from '@Queries/fs-training-menu-collection-query';
import { TrainingMenuCollectionQueryUsecase } from '@Usecases/training-menu-collection-query-usecase';
import useSWR from 'swr';

const trainingMenuQueryUsecase = new TrainingMenuCollectionQueryUsecase({
  trainingMenuCollectionQuery: new FSTrainingMenuCollectionQuery(),
});

const useTrainingMenus = (prop: { userId?: string }) => {
  const { data, error } = useSWR(
    ['trainingMenu/query', prop.userId],
    (_: string, userId: string) => {
      if (!userId) {
        throw new ParameterError('ユーザーIDは必須です。');
      }
      return trainingMenuQueryUsecase.queryDetail({ userId });
    }
  );

  return {
    isLoading: !data && !error,
    isError: error,
    trainingMenus: data?.trainingMenus ?? [],
  };
};
export default useTrainingMenus;
