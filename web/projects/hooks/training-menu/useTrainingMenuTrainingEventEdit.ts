import {
  TrainingMenu,
  TrainingMenuDto,
  TrainingMenuFullId,
} from '@Domains/training-menu/training-menu';
import { RequireError } from '@Errors/require-error';
import useTrainingMenu from '@Hooks/training-menu/useTrainingMenu';
import { FSTrainingEventQuery } from '@Queries/fs-training-event-query';
import { FSTrainingMenuCollectionRepository } from '@Repositories/fs-training-menu-collection-repository';
import {
  TrainingEventQueryUsecase,
  TrainingEventWithCategoryDto,
} from '@Usecases/training-event-query-usecase';
import { TrainingMenuCollectionCommandUsecase } from '@Usecases/training-menu-collection-command-usecase';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const trainingEventQueryUsecase = new TrainingEventQueryUsecase({
  trainingEventQuery: new FSTrainingEventQuery(),
});

const trainingMenuCollectionCommandUsecase =
  new TrainingMenuCollectionCommandUsecase({
    trainingMenuCollectionRepository: new FSTrainingMenuCollectionRepository(),
  });

type UseTrainingEventsProp = Partial<TrainingMenuFullId>;

const useTrainingMenuTrainingEventEdit = (prop: UseTrainingEventsProp) => {
  const { data: trainingEvents, error: trainingEventsError } = useSWR(
    ['trainingEvent/queryListAll', prop.userId],
    (_, userId: string) => {
      if (!userId) {
        throw new RequireError('ユーザーID');
      }

      return trainingEventQueryUsecase.queryList({ userId });
    }
  );

  const {
    trainingMenu,
    isLoading: trainingMenuIsLoading,
    isError: trainingMenuIsError,
  } = useTrainingMenu(prop);
  const [_selectedTrainingEventIds, setSelectedTrainingEventIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    setSelectedTrainingEventIds(trainingMenu?.trainingEventIds ?? []);
  }, [trainingMenu]);

  if (trainingMenuIsLoading || (!trainingEvents && !trainingEventsError)) {
    return {
      isLoading: true as const,
      isError: false as const,
      trainingMenu: null,
      trainingEvents: null,
      errors: [],
    };
  }

  if (trainingEventsError || trainingMenuIsError) {
    return {
      isLoading: false as const,
      isError: true as const,
      trainingMenu: null,
      trainingEvents: null,
      error: trainingEventsError ?? trainingMenuIsError,
    };
  }

  return {
    isLoading: false as const,
    isError: false as const,
    errors: [] as const,
    trainingMenu: trainingMenu as TrainingMenuDto,
    trainingEvents: trainingEvents as TrainingEventWithCategoryDto[],
    selectedTrainingEventIds: _selectedTrainingEventIds,
    toggleTrainingEvent: (trainingEventId: string) => {
      const index = _selectedTrainingEventIds.findIndex(
        (selectedTrainingEventId) => trainingEventId === selectedTrainingEventId
      );

      if (index < 0) {
        const work = [..._selectedTrainingEventIds, trainingEventId];
        TrainingMenu.validateTrainingEvents(work);
        setSelectedTrainingEventIds(work);
      } else {
        const work = [..._selectedTrainingEventIds];
        work.splice(index, 1);
        setSelectedTrainingEventIds(work);
      }
    },
    save: async () => {
      await trainingMenuCollectionCommandUsecase.editTrainingMenuTrainingEvents(
        {
          trainingMenuId: prop.trainingMenuId as string,
          userId: prop.userId as string,
          trainingEventIds: _selectedTrainingEventIds,
        }
      );
    },
  };
};

export default useTrainingMenuTrainingEventEdit;
