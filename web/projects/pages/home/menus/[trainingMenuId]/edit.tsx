import { PageInjection } from '@/pages/_app';
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
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const TrainingMenuEditPage: NextPage<PageInjection> = ({
  popMessage,
  auth,
}) => {
  const router = useRouter();
  const trainingMenuId = router.query.trainingMenuId as string;
  const { startProcessing, isProcessing } = useProcessing();

  const {
    trainingEvents,
    isError,
    isLoading,
    toggleTrainingEvent,
    selectedTrainingEventIds,
    save,
    error,
  } = useTrainingMenuEdit({
    trainingMenuId,
    userId: auth.auth.authId,
  });

  if (isError) {
    console.error(error);
    return <ReadErrorTemplate />;
  }

  if (isLoading) {
    return <CenteredProgress />;
  }

  if (!auth.auth.authId) {
    return <AuthErrorTemplate />;
  }

  const goBack = () => {
    return startProcessing(() =>
      router.push({
        pathname: `/home/menus/${trainingMenuId}`,
        query: {
          ...router.query,
        },
      })
    );
  };

  const saveHandler = async () => {
    try {
      await startProcessing(async () => {
        await save();
        await goBack();
      });
    } catch (e: any) {
      popMessage.error(e);
    }
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
                onClick={() => {
                  try {
                    toggleTrainingEvent(trainingEvent.trainingEventId);
                  } catch (e: any) {
                    popMessage.error(e);
                  }
                }}
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
          <PrimaryButton onClick={saveHandler} disabled={isProcessing}>
            トレーニングメニューを更新する
          </PrimaryButton>
        </Box>
      </SectionContainer>
    </PageContainer>
  );
};

export default TrainingMenuEditPage;
