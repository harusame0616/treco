import { AuthContext } from '@/pages/_app';
import AuthErrorTemplate from '@Components/case/auth-error-template';
import CenteredProgress from '@Components/case/centered-progress';
import ListItemCard from '@Components/case/list-item-card';
import PrimaryButton from '@Components/case/primary-button';
import ReadErrorTemplate from '@Components/case/read-error-template';
import SecondaryButton from '@Components/case/secondary-button';
import PageContainer from '@Components/container/page-container';
import SectionContainer from '@Components/container/section-container';
import CategoryLabel from '@Components/domain/category-label';
import useTrainingMenuEdit from '@Hooks/training-menu/useTrainingMenuTrainingEventEdit';
import useProcessing from '@Hooks/useProcessing';
import { Box } from '@mui/material';
import { FSTrainingMenuCollectionRepository } from '@Repositories/fs-training-menu-collection-repository';
import { TrainingMenuCollectionCommandUsecase } from '@Usecases/training-menu-collection-command-usecase';
import { useRouter } from 'next/router';
import { useContext } from 'react';

const trainingMenuCollectionCommandUsecase =
  new TrainingMenuCollectionCommandUsecase({
    trainingMenuCollectionRepository: new FSTrainingMenuCollectionRepository(),
  });

const TrainingMenuEditPage = () => {
  const router = useRouter();
  const trainingMenuId = router.query.trainingMenuId as string;
  const { startProcessing, isProcessing } = useProcessing();

  const auth = useContext(AuthContext);

  const {
    trainingEvents,
    isError,
    isLoading,
    toggleTrainingEvent,
    selectedTrainingEventIds,
    error,
  } = useTrainingMenuEdit({
    trainingMenuId,
    userId: auth.auth.authId,
  });

  if (isError) {
    return <ReadErrorTemplate />;
  }
  if (isLoading) {
    return <CenteredProgress />;
  }

  const userId = auth.auth.authId;
  if (!userId) {
    return <AuthErrorTemplate />;
  }

  const goBack = () => {
    return router.push({
      pathname: `/home/menus/${trainingMenuId}`,
      query: {
        ...router.query,
      },
    });
  };

  const save = async () => {
    startProcessing(async () => {
      await trainingMenuCollectionCommandUsecase.editTrainingMenuTrainingEvents(
        {
          userId,
          trainingMenuId,
          trainingEventIds: selectedTrainingEventIds,
        }
      );
      await goBack();
    });
  };

  return (
    <PageContainer>
      <SectionContainer>
        <Box display="flex" flexDirection="column" gap="5px">
          {trainingEvents.map((trainingEvent, index, trainingEvents) => (
            <>
              {trainingEvents[index - 1]?.categoryId !=
              trainingEvent.categoryId ? (
                <Box marginTop="10px">
                  <CategoryLabel color={trainingEvent.color}>
                    {trainingEvent.categoryName}
                  </CategoryLabel>
                </Box>
              ) : undefined}
              <ListItemCard
                key={trainingEvent.trainingEventId}
                onClick={() =>
                  toggleTrainingEvent(trainingEvent.trainingEventId)
                }
              >
                {(() => {
                  const index = selectedTrainingEventIds.findIndex(
                    (selectedTrainingEventId) =>
                      trainingEvent.trainingEventId === selectedTrainingEventId
                  );
                  if (index < 0) {
                    return undefined;
                  }

                  return (
                    <>
                      <Box
                        position="absolute"
                        left={'-20px'}
                        top={'-10px'}
                        width="calc(100% + 40px)"
                        height="calc(100% + 40px)"
                        sx={{ background: 'black', opacity: '60%' }}
                      />
                      <Box
                        position="absolute"
                        right="-25px"
                        top="50%"
                        width="30px"
                        height="30px"
                        borderRadius="5px"
                        color="red"
                        sx={{
                          border: '1px solid',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          transform: 'translate(-50%, -50%)',
                          background: 'black',
                          boxShadow: '5px 5px 5px black',
                        }}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        {index < 0 ? '' : index + 1}
                      </Box>
                    </>
                  );
                })()}
                {trainingEvent.trainingEventName}
              </ListItemCard>
            </>
          ))}
        </Box>
      </SectionContainer>
      <SectionContainer>
        <Box display="flex" flexDirection="column" gap="5px">
          <SecondaryButton onClick={goBack} disabled={isProcessing}>
            キャンセルする
          </SecondaryButton>
          <PrimaryButton onClick={save} disabled={isProcessing}>
            {' '}
            トレーニングメニューを更新する
          </PrimaryButton>
        </Box>
      </SectionContainer>
    </PageContainer>
  );
};

export default TrainingMenuEditPage;
