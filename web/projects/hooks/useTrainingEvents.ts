import { FSCategoryQuery } from '../contexts/record/infrastructure/query/fs-category-query';
import { FSTrainingEventQuery } from '../contexts/record/infrastructure/query/fs-training-event-query';
import { TrainingEventQueryUsecase } from '../contexts/record/usecases/training-event-query-usecase';
import useSWR from 'swr';
import { ParameterError } from '../custom-error/parameter-error';

interface UseTrainingEventsProp {
  userId?: string | null;
  categoryId?: string | null;
}

const trainingEventQueryUsecase = new TrainingEventQueryUsecase({
  trainingEventQuery: new FSTrainingEventQuery(),
  categoryQuery: new FSCategoryQuery(),
});

const useTrainingEvents = (prop: UseTrainingEventsProp) => {
  const { data, error } = useSWR(
    ['trainingEvent/queryListInCategory', prop.userId, prop.categoryId],
    (_, userId?: string | null, categoryId?: string | null) => {
      if (!userId || !categoryId) {
        throw new ParameterError('userId and categoryId is required.');
      }

      return trainingEventQueryUsecase.queryListInCategory(userId, categoryId);
    },
    { refreshInterval: 200 }
  );

  return {
    isLoading:
      prop.categoryId == null || prop.userId == null || (!error && !data),
    isError: prop.categoryId && prop.userId && error,
    trainingEvents: data ?? [],
  };
};
export default useTrainingEvents;
