import { PageInjection } from '@/pages/_app';
import BaseCircleButton from '@Components/base/base-circle-button';
import CenteredProgress from '@Components/case/centered-progress';
import ListItemCard from '@Components/case/list-item-card';
import ReadErrorTemplate from '@Components/case/read-error-template';
import SecondaryButton from '@Components/case/secondary-button';
import PageContainer from '@Components/container/page-container';
import SectionContainer from '@Components/container/section-container';
import useTrainingMenu from '@Hooks/training-menu/useTrainingMenu';
import useActivities from '@Hooks/useActivities';
import { CheckRounded, EditRounded } from '@mui/icons-material';
import { Box, Collapse } from '@mui/material';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { TransitionGroup } from 'react-transition-group';

const TrainingMenuDetail: NextPage<PageInjection> = ({ auth, pageTitle }) => {
  const router = useRouter();
  const trainingMenuId = router.query.trainingMenuId as string;

  const { trainingMenu, isLoading, isError, error } = useTrainingMenu({
    trainingMenuId,
    userId: auth.auth.authId,
  });

  const {
    activities,
    isLoading: activitiesIsLoading,
    isError: activitiesAreError,
    error: activitiesError,
  } = useActivities({
    userId: auth.auth.authId,
    date: new Date(router.query.date as any),
  });

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

  if (isError || activitiesAreError) {
    console.error({ error, activitiesError });
    return <ReadErrorTemplate />;
  }
  if (isLoading || activitiesIsLoading) {
    return <CenteredProgress />;
  }

  const goNext = async ({
    trainingEventId,
    categoryId,
  }: {
    trainingEventId: string;
    categoryId: string;
  }) => {
    await router.push({
      pathname: '/home/categories/record',
      query: {
        ...router.query,
        trainingEventId,
        categoryId,
        returnTo: `/home/menus/${trainingMenuId}`,
        returnQuery: JSON.stringify(router.query),
      },
    });
  };

  const goToEdit = async () => {
    await router.push({
      pathname: `/home/menus/${trainingMenuId}/edit`,
      query: {
        ...router.query,
        returnTo: `/home/menus/${trainingMenuId}`,
        returnQuery: JSON.stringify(router.query),
      },
    });
  };

  const goBack = () => {
    router.push({
      pathname: '/home/menus',
      query: router.query,
    });
  };

  return (
    <PageContainer>
      <SectionContainer>
        記録するトレーニング種目を選択してください。
      </SectionContainer>
      <SectionContainer>
        {trainingMenu.name}
        <TransitionGroup>
          {trainingMenu.trainingEvents.map(
            ({ trainingEventId, trainingEventName, categoryId }) => (
              <Collapse key={trainingEventId} sx={{ marginBottom: '5px' }}>
                <ListItemCard
                  onClick={() => goNext({ categoryId, trainingEventId })}
                >
                  {(() =>
                    activities
                      .map((activity) => activity.trainingEventId)
                      .includes(trainingEventId) ? (
                      <>
                        <Box
                          position="absolute"
                          left={'-20px'}
                          top={'-10px'}
                          width="calc(100% + 40px)"
                          height="calc(100% + 20px)"
                          sx={{ background: 'black', opacity: '60%' }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
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
                          <CheckRounded />
                        </Box>
                      </>
                    ) : undefined)()}

                  <Box flexGrow={1} flexShrink={0}>
                    {trainingEventName}
                  </Box>
                </ListItemCard>
              </Collapse>
            )
          )}
        </TransitionGroup>
      </SectionContainer>
      <SectionContainer>
        <SecondaryButton onClick={goBack}>
          トレーニングメニュー選択に戻る
        </SecondaryButton>
      </SectionContainer>
      <Box position="fixed" right="20px" bottom="60px" zIndex="1">
        <BaseCircleButton onClick={() => goToEdit()}>
          <EditRounded />
        </BaseCircleButton>
      </Box>
    </PageContainer>
  );
};

export default TrainingMenuDetail;
