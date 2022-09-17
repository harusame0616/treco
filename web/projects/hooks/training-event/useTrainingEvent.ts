import { ParameterError } from '@Errors/parameter-error';
import { FSTrainingEventQuery } from '@Queries/fs-training-event-query';
import { TrainingEventQueryUsecase } from '@Usecases/training-event-query-usecase';
import useSWR from 'swr';

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
