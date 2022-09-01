import { EditRounded } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import BaseProgress from '../../../../components/base/base-progress';
import AddButton from '../../../../components/case/add-button';
import DeleteConfirmDialog from '../../../../components/case/delete-confirm-dialog';
import DeleteSlideAction from '../../../../components/case/delete-slide-action';
import ListItemCard from '../../../../components/case/list-item-card';
import SecondaryButton from '../../../../components/case/secondary-button';
import ListContainer from '../../../../components/container/list-container';
import PageContainer from '../../../../components/container/page-container';
import SectionContainer from '../../../../components/container/section-container';
import CategoryLabel from '../../../../components/domain/category-label';
import TrainingEventEditPopup, {
  TrainingEventEditInfo,
} from '../../../../components/domain/training-event/training-event-edit-popup';
import { TrainingEventDto } from '../../../../contexts/record/domains/training-event/training-event';
import { FSTrainigEventRepository } from '../../../../contexts/record/infrastructure/repository/fs-training-event-repository';
import { TrainingEventCommandUsecase } from '../../../../contexts/record/usecases/training-event-command-usecase';
import { ParameterError } from '../../../../custom-error/parameter-error';
import useCategory from '../../../../hooks/useCategory';
import useDialog from '../../../../hooks/useDialog';
import useTrainingEvents from '../../../../hooks/useTrainingEvents';
import { AuthContext, PopMessageContext, TitleContext } from '../../../_app';

const trainingEventCommandUsecase = new TrainingEventCommandUsecase({
  trainingEventRepository: new FSTrainigEventRepository(),
});

const NewEvent = () => {
  const router = useRouter();
  const categoryId = router.query['categoryId'];
  if (typeof categoryId != 'string') {
    throw new ParameterError('カテゴリIDが不正です。');
  }

  const { open, isOpen, close } = useDialog();
  const auth = useContext(AuthContext);
  const popMessage = useContext(PopMessageContext);
  const { setTitle } = useContext(TitleContext);

  const [editPopup, setEditPopup] = useState(false);

  const [exceptTrainingEvents, setExceptTrainingEvents] = useState<
    TrainingEventDto[]
  >([]);
  const { isLoading, trainingEvents: _trainingEvents } = useTrainingEvents({
    categoryId: categoryId as string,
    userId: auth?.auth?.authId,
  });

  // 削除ボタンを押してから実際に削除されて反映されるまでにラグがあるので、
  // 削除が実行された項目は除外して即座に反映しているように見せる
  const trainingEvents = useMemo(
    () =>
      _trainingEvents.filter(
        (trainingEvent) =>
          !exceptTrainingEvents
            .map((trainingEvent) => trainingEvent.trainingEventId)
            .includes(trainingEvent.trainingEventId)
      ),
    [_trainingEvents, exceptTrainingEvents]
  );

  const { isLoading: categoryIsLoading, category } = useCategory({
    categoryId: categoryId as string,
    userId: auth?.auth?.authId,
  });

  const [selectedTrainingEvent, setSelectedTrainingEvent] = useState<
    TrainingEventDto | undefined
  >();

  const goToBack = () => {
    router.push({
      pathname: '/home/activities/new',
      query: router.query,
    });
  };

  const goToNext = async (trainingEventId: string) => {
    await router.push({
      pathname: '/home/activities/new/record',
      query: {
        ...router.query,
        categoryId,
        trainingEventId,
        returnTo: '/home/activities/new/training-event',
        returnQuery: JSON.stringify(router.query),
      },
    });
  };

  const popError = (error: Error) => {
    popMessage?.(error.message, { mode: 'error' });
  };

  const saveTrainingEvent = (
    data: TrainingEventEditInfo,
    reset: () => void
  ) => {
    if (selectedTrainingEvent) {
      if (
        trainingEvents
          .filter(
            (trainingEvent) =>
              trainingEvent.trainingEventId !=
              selectedTrainingEvent.trainingEventId
          )
          .map((trainingEvent) => trainingEvent.trainingEventName)
          .includes(data.trainingEventName)
      ) {
        return popMessage?.('同じ名前のトレーニング種目が登録済みです。', {
          mode: 'error',
        });
      }

      trainingEventCommandUsecase.editTrainingEvent({
        ...selectedTrainingEvent,
        ...data,
      });
    } else {
      if (
        trainingEvents
          .map((trainingEvent) => trainingEvent.trainingEventName)
          .includes(data.trainingEventName)
      ) {
        return popMessage?.('同じ名前のトレーニング種目が登録済みです。', {
          mode: 'error',
        });
      }

      trainingEventCommandUsecase.createNewTrainingEvent({
        userId: auth!.auth!.authId as string,
        categoryId,
        ...data,
      });
    }

    setEditPopup(false);
    reset();
  };

  const openTrainingEventEditPopup = (trainingEvent?: TrainingEventDto) => {
    setSelectedTrainingEvent(trainingEvent);
    setEditPopup(true);
  };

  const deleteTrainingEvent = () => {
    if (!selectedTrainingEvent) {
      throw new Error('トレーニング種目が選択されていません');
    }

    trainingEventCommandUsecase.deleteTrainingEvent(selectedTrainingEvent);
    setExceptTrainingEvents([...exceptTrainingEvents, selectedTrainingEvent]);
    close();
  };

  useEffect(() => {
    const { date } = router.query;
    if (!setTitle || typeof date !== 'string') {
      return;
    }

    setTitle(dayjs(date).format('YYYY-MM-DD'));
  }, [router.query, setTitle]);

  return (
    <>
      <PageContainer>
        <SectionContainer>記録する種目を選択してください。</SectionContainer>
        <CategoryLabel color={category?.color}>
          {categoryIsLoading
            ? '読み込み中'
            : category?.categoryName ?? 'カテゴリ読み取りエラー'}
        </CategoryLabel>

        <SectionContainer>
          {isLoading ? (
            <Box display="flex" justifyContent="center">
              <BaseProgress />
            </Box>
          ) : (
            <ListContainer>
              {trainingEvents
                ? trainingEvents.map((event) => (
                    <DeleteSlideAction
                      key={event.trainingEventId}
                      onDeleteClick={() => {
                        setSelectedTrainingEvent(event);
                        open();
                      }}
                    >
                      <ListItemCard
                        onClick={() => goToNext(event.trainingEventId)}
                      >
                        <Box flexGrow={1} flexShrink={0}>
                          {event.trainingEventName}
                        </Box>
                        <Box flexGrow={0} flexShrink={1}>
                          <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              openTrainingEventEditPopup(event);
                            }}
                          >
                            <EditRounded />
                          </IconButton>
                        </Box>
                      </ListItemCard>
                    </DeleteSlideAction>
                  ))
                : 'トレーニング種目読み込みエラー'}
            </ListContainer>
          )}
        </SectionContainer>

        <SectionContainer>
          <SecondaryButton onClick={goToBack}>
            カテゴリ選択に戻る
          </SecondaryButton>
        </SectionContainer>
      </PageContainer>
      <DeleteConfirmDialog
        open={isOpen}
        onPrimaryClick={deleteTrainingEvent}
        onSecondaryClick={close}
      />
      <TrainingEventEditPopup
        open={editPopup}
        onError={popError}
        default={selectedTrainingEvent}
        onPirmaryClick={saveTrainingEvent}
        onSecondaryClick={(_, reset) => {
          setEditPopup(false);
          reset();
        }}
      />
      <Box position="fixed" right="20px" bottom="20px" zIndex="1">
        <AddButton
          onClick={() => {
            openTrainingEventEditPopup();
          }}
        />
      </Box>
    </>
  );
};

export default NewEvent;
