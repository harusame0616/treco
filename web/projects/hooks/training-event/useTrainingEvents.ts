import { RequireError } from '@Errors/require-error';
import useSWR from 'swr';
import { FSTrainingEventQuery } from '@Queries/fs-training-event-query';
import { TrainingEventQueryUsecase } from '@Usecases/training-event-query-usecase';

interface UseTrainingEventsProp {
  userId?: string | null;
  categoryId?: string | null;
}

const trainingEventQueryUsecase = new TrainingEventQueryUsecase({
  trainingEventQuery: new FSTrainingEventQuery(),
});

const useTrainingEvents = (prop: UseTrainingEventsProp) => {
  const { data, error, mutate } = useSWR(
    ['trainingEvent/queryListInCategory', prop.userId, prop.categoryId],
    (_, userId?: string, categoryId?: string) => {
      if (!userId) {
        throw new RequireError('ユーザーID');
      }
      if (!categoryId) {
        throw new RequireError('カテゴリID');
      }

      return trainingEventQueryUsecase.queryListInCategory(userId, categoryId);
    }
  );

  if (!error && !data) {
    return {
      isLoading: true as const,
      isError: false as const,
      trainingEvents: null,
    };
  }

  if (error) {
    return {
      isLoading: false as const,
      isError: true as const,
      trainingEvents: null,
      error,
    };
  }

  return {
    isLoading: false as const,
    isError: false as const,
    trainingEvents: data ?? [],
    async refresh() {
      await mutate();
    },
  };
};

export default useTrainingEvents;
