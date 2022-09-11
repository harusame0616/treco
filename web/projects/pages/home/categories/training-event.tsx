import { PageInjection } from '@/pages/_app';
import AddButton from '@Components/case/add-button';
import CenteredProgress from '@Components/case/centered-progress';
import DeleteConfirmDialog from '@Components/case/delete-confirm-dialog';
import DeleteSlideAction from '@Components/case/delete-slide-action';
import ListItemCard from '@Components/case/list-item-card';
import ReadErrorTemplate from '@Components/case/read-error-template';
import SecondaryButton from '@Components/case/secondary-button';
import PageContainer from '@Components/container/page-container';
import SectionContainer from '@Components/container/section-container';
import CategoryLabel from '@Components/domain/category-label';
import TrainingEventEditPopup, {
  TrainingEventEditInfo,
} from '@Components/domain/training-event/training-event-edit-popup';
import { TrainingEventDto } from '@Domains/training-event/training-event';
import useCategory from '@Hooks/useCategory';
import useDialog from '@Hooks/useDialog';
import useProcessing from '@Hooks/useProcessing';
import useTrainingEvents from '@Hooks/useTrainingEvents';
import { EditRounded } from '@mui/icons-material';
import { Box, Collapse, IconButton } from '@mui/material';
import { FSTrainigEventRepository } from '@Repositories/fs-training-event-repository';
import { TrainingEventCommandUsecase } from '@Usecases/training-event-command-usecase';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

const trainingEventCommandUsecase = new TrainingEventCommandUsecase({
  trainingEventRepository: new FSTrainigEventRepository(),
});

const TrainingEventsInCategory: NextPage<PageInjection> = ({
  auth,
  popMessage,
  pageTitle,
}) => {
  const router = useRouter();
  const categoryId = router.query.categoryId as string;

  const { open, isOpen, close } = useDialog();
  const [editPopup, setEditPopup] = useState(false);

  const { isLoading, trainingEvents, isError, refresh } = useTrainingEvents({
    categoryId: categoryId as string,
    userId: auth?.auth?.authId,
  });

  const {
    isLoading: categoryIsLoading,
    isError: categoryIsError,
    category,
  } = useCategory({
    categoryId: categoryId as string,
    userId: auth.auth.authId,
  });

  const [selectedTrainingEvent, setSelectedTrainingEvent] = useState<
    TrainingEventDto | undefined
  >();
  const { isProcessing, startProcessing } = useProcessing();

  useEffect(() => {
    const { date } = router.query;
    if (typeof date !== 'string') {
      return;
    }

    pageTitle.setTitle(dayjs(date).format('YYYY-MM-DD'));
    pageTitle.setClickListener(() => {
      router.push({
        pathname: '/home/',
        query: router.query,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  if (isLoading || categoryIsLoading) {
    return <CenteredProgress />;
  }

  if (isError || categoryIsError) {
    return <ReadErrorTemplate />;
  }

  const goBack = () => {
    router.push({
      pathname: '/home/categories',
      query: router.query,
    });
  };

  const goNext = async (trainingEventId: string) => {
    await router.push({
      pathname: '/home/categories/record',
      query: {
        ...router.query,
        categoryId,
        trainingEventId,
        returnTo: '/home/categories/training-event',
        returnQuery: JSON.stringify(router.query),
      },
    });
  };

  const saveTrainingEvent = async (data: TrainingEventEditInfo) => {
    startProcessing(async () => {
      try {
        if (selectedTrainingEvent) {
          await trainingEventCommandUsecase.editTrainingEvent({
            ...selectedTrainingEvent,
            ...data,
          });
        } else {
          await trainingEventCommandUsecase.createNewTrainingEvent({
            userId: auth!.auth!.authId as string,
            categoryId,
            ...data,
          });
        }

        setEditPopup(false);
        await refresh();
      } catch (err: any) {
        popMessage.error(err);
      }
    });
  };

  const openTrainingEventEditPopup = (trainingEvent?: TrainingEventDto) => {
    setSelectedTrainingEvent(trainingEvent);
    setEditPopup(true);
  };

  const deleteTrainingEvent = async () => {
    await startProcessing(async () => {
      try {
        if (!selectedTrainingEvent) {
          throw new Error('トレーニング種目が選択されていません');
        }

        await trainingEventCommandUsecase.deleteTrainingEvent(
          selectedTrainingEvent
        );
        await refresh();
        close();
      } catch (err: any) {
        popMessage.error(err);
      }
    });
  };

  return (
    <>
      <PageContainer>
        <SectionContainer>記録する種目を選択してください。</SectionContainer>
        <CategoryLabel color={category.color}>
          {category.categoryName}
        </CategoryLabel>

        <SectionContainer>
          <TransitionGroup>
            {trainingEvents.map((event) => (
              <Collapse
                key={event.trainingEventId}
                sx={{ marginBottom: '5px' }}
              >
                <DeleteSlideAction
                  onDeleteClick={() => {
                    setSelectedTrainingEvent(event);
                    open();
                  }}
                >
                  <ListItemCard onClick={() => goNext(event.trainingEventId)}>
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
              </Collapse>
            ))}
          </TransitionGroup>
        </SectionContainer>

        <SectionContainer>
          <SecondaryButton onClick={goBack}>カテゴリ選択に戻る</SecondaryButton>
        </SectionContainer>
      </PageContainer>
      <DeleteConfirmDialog
        open={isOpen}
        onPrimaryClick={deleteTrainingEvent}
        onSecondaryClick={close}
        isLoading={isProcessing}
      />
      <TrainingEventEditPopup
        open={editPopup}
        onError={(err) => popMessage.error(err)}
        default={selectedTrainingEvent}
        onPirmaryClick={saveTrainingEvent}
        onSecondaryClick={(_, reset) => {
          setEditPopup(false);
          reset();
        }}
        isLoading={isProcessing}
      />
      <Box position="fixed" right="20px" bottom="60px" zIndex="1">
        <AddButton
          onClick={() => {
            openTrainingEventEditPopup();
          }}
        />
      </Box>
    </>
  );
};

export default TrainingEventsInCategory;
