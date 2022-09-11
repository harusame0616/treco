import useSWR from 'swr';
import { FSCategoryQuery } from '../contexts/record/infrastructure/query/fs-category-query';
import { FSTrainingEventQuery } from '../contexts/record/infrastructure/query/fs-training-event-query';
import { TrainingEventQueryUsecase } from '../contexts/record/usecases/training-event-query-usecase';
import { ParameterError } from '../custom-error/parameter-error';

interface UseTrainingEventProp {
  userId?: string | null;
  categoryId?: string | null;
  trainingEventId?: string | null;
}

const trainingEventQueryUsecase = new TrainingEventQueryUsecase({
  trainingEventQuery: new FSTrainingEventQuery(),
});

const useTrainingEvent = (prop: UseTrainingEventProp) => {
  const { data, error } = useSWR(
    [
      'trainingEvent/queryDetail',
      prop.userId,
      prop.categoryId,
      prop.trainingEventId,
    ],
    (
      _,
      userId?: string | null,
      categoryId?: string | null,
      trainingEventId?: string | null
    ) => {
      if (!userId || !categoryId || !trainingEventId) {
        throw new ParameterError(
          'userId and categoryId and trainingEventId is required.'
        );
      }

      return trainingEventQueryUsecase.queryDetail(
        userId,
        categoryId,
        trainingEventId
      );
    }
  );

  return {
    isLoading:
      !prop.categoryId ||
      !prop.userId ||
      !prop.trainingEventId ||
      (!error && !data),
    isError: prop.categoryId && prop.userId && prop.trainingEventId && error,
    trainingEvent: data ?? null,
  };
};
export default useTrainingEvent;
