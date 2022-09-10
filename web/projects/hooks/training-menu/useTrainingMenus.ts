import { RequireError } from '@Errors/require-error';
import { FSTrainingMenuCollectionQuery } from '@Queries/fs-training-menu-collection-query';
import { TrainingMenuCollectionQueryUsecase } from '@Usecases/training-menu-collection-query-usecase';
import useSWR from 'swr';

const trainingMenuQueryUsecase = new TrainingMenuCollectionQueryUsecase({
  trainingMenuCollectionQuery: new FSTrainingMenuCollectionQuery(),
});

const useTrainingMenus = (prop: { userId?: string }) => {
  const { data, error, mutate } = useSWR(
    ['trainingMenu/query', prop.userId],
    (_: string, userId: string) => {
      if (!userId) {
        throw new RequireError('ユーザーID');
      }
      return trainingMenuQueryUsecase.queryDetail({ userId });
    }
  );

  if (!data && !error) {
    return {
      isError: false as const,
      isLoading: true as const,
      trainingMenus: null,
    };
  }

  if (error) {
    return {
      isError: true as const,
      isLoading: false as const,
      trainingMenus: null,
      error,
    };
  }

  return {
    isLoading: false as const,
    isError: false as const,
    trainingMenus: data?.trainingMenus ?? [],
    refresh() {
      mutate();
    },
  };
};

export default useTrainingMenus;
