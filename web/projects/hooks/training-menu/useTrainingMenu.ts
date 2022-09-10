import { TrainingMenuFullId } from '@Domains/training-menu/training-menu';
import { RequireError } from '@Errors/require-error';
import { FSTrainingMenuCollectionQuery } from '@Queries/fs-training-menu-collection-query';
import {
  TrainingMenuCollectionQueryUsecase,
  TrainingMenuWithTrainingEventsDto,
} from '@Usecases/training-menu-collection-query-usecase';
import useSWR from 'swr';

type UseTrainingMenuProp = Partial<TrainingMenuFullId>;

const trainingMenuCollectionQuery = new TrainingMenuCollectionQueryUsecase({
  trainingMenuCollectionQuery: new FSTrainingMenuCollectionQuery(),
});

const useTrainingMenu = (prop: UseTrainingMenuProp) => {
  const { data, error } = useSWR(
    ['trainingMenu/detail', prop.userId, prop.trainingMenuId],
    (_, userId?: string, trainingMenuId?: string) => {
      if (!userId) {
        throw new RequireError('ユーザーID');
      }
      if (!trainingMenuId) {
        throw new RequireError('トレーニングメニューID');
      }

      return trainingMenuCollectionQuery.queryTrainingMenuByTrainingMenuId({
        userId,
        trainingMenuId,
      });
    },
    { refreshInterval: 100 }
  );

  if (!error && !data) {
    return {
      isLoading: true as const,
      isError: false as const,
      trainingMenu: null,
    };
  }

  if (error) {
    return {
      isLoading: false as const,
      isError: true as const,
      trainingMenu: null,
      error,
    };
  }

  return {
    isLoading: false as const,
    isError: false as const,
    trainingMenu: data as TrainingMenuWithTrainingEventsDto,
  };
};

export default useTrainingMenu;
