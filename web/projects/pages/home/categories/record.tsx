import { PageInjection } from '@/pages/_app';
import BaseCard from '@Components/base/base-card';
import AddButton from '@Components/case/add-button';
import CenteredProgress from '@Components/case/centered-progress';
import DeleteSlideAction from '@Components/case/delete-slide-action';
import PrimaryButton from '@Components/case/primary-button';
import ReadErrorTemplate from '@Components/case/read-error-template';
import SecondaryButton from '@Components/case/secondary-button';
import PageContainer from '@Components/container/page-container';
import SectionContainer from '@Components/container/section-container';
import ActivityListItem from '@Components/domain/activity-list-item';
import CategoryLabel from '@Components/domain/category-label';
import RecordCard from '@Components/domain/record-card';
import { Activity } from '@Domains/activity/activity';
import useActivityEdit from '@Hooks/useActivityEdit';
import useActivityOfLastTrainingEvent from '@Hooks/useActivityOfLastTrainingEvent';
import useProcessing from '@Hooks/useProcessing';
import { ArrowForwardIosRounded } from '@mui/icons-material';
import { Box, Collapse } from '@mui/material';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

const RecordEditPage: NextPage<PageInjection> = ({
  auth,
  pageTitle,
  popMessage,
}) => {
  const router = useRouter();

  const apiProp = useMemo(
    () => ({
      userId: auth?.auth?.authId,
      categoryId: router.query['categoryId'] as string,
      trainingEventId: router.query['trainingEventId'] as string,
      activityId: router.query['activityId'] as string,
    }),
    [router.query, auth?.auth.authId]
  );

  const { isProcessing, startProcessing } = useProcessing();
  const lastRecordRef = useRef<HTMLElement | null>(null);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const selectedRecordRef = useRef<HTMLElement | null>(null);
  const {
    activity: lastActivity,
    isLoading: lastActivityIsLoading,
    isError: lastActivityIsError,
    error: lastActivityError,
  } = useActivityOfLastTrainingEvent(apiProp);

  const {
    records,
    trainingEvent,
    setRecord,
    addNewRecord,
    isLoading,
    register,
    errorRecordIndex,
    deleteRecord,
    isError,
    error: activityEditError,
  } = useActivityEdit({
    ...apiProp,
    date: new Date(router.query['date'] as string),
  });

  useEffect(() => {
    if (typeof router.query.date !== 'string') {
      return;
    }

    pageTitle.setTitle(dayjs(router.query.date).format('YYYY-MM-DD'));
    pageTitle.setClickListener(() => {
      router.push({
        pathname: '/home/',
        query: router.query,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.date]);

  useEffect(() => {
    if (isError || lastActivityIsError) {
      return;
    }

    if (isLoading || lastActivityIsLoading) {
      return;
    }

    if (selectedRecordIndex - 1 === records?.length) {
      lastRecordRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    } else {
      selectedRecordRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecordIndex]);

  if (isError || lastActivityIsError) {
    console.error({ activityEditError, lastActivityError });
    return <ReadErrorTemplate />;
  }

  if (isLoading || lastActivityIsLoading) {
    return <CenteredProgress />;
  }

  const goBack = async (param?: { query: object }) => {
    await router.push({
      pathname: router.query.returnTo as string,
      query: {
        ...param?.query,
        ...(typeof router.query.returnQuery === 'string'
          ? JSON.parse(router.query.returnQuery)
          : {}),
      },
    });
  };

  const discard = async () => {
    await goBack();
  };

  const save = async () => {
    await startProcessing(async () => {
      try {
        await register();
        await goBack();
        return popMessage.popMessage('登録しました。');
      } catch (err: any) {
        return popMessage.error(err);
      }
    });
  };

  return (
    <PageContainer>
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          scrollSnapType: 'y mandatory',
          overflowY: 'auto',
          height: 'calc(100vh - 240px)',
        }}
        flexGrow="1"
      >
        <SectionContainer>
          <Box
            display="flex"
            gap="10px"
            sx={{ scrollSnapAlign: 'start' }}
            alignItems="center"
          >
            <CategoryLabel color={trainingEvent?.color}>
              <Box display="flex" alignItems="center" gap="5px" flexGrow="1">
                {trainingEvent.categoryName}{' '}
                <ArrowForwardIosRounded sx={{ fontSize: '0.8rem' }} />
                {trainingEvent.trainingEventName}{' '}
              </Box>
            </CategoryLabel>
          </Box>
        </SectionContainer>
        <SectionContainer>
          {lastActivity ? (
            <ActivityListItem
              activity={lastActivity}
              label={
                <Box
                  fontSize="1rem"
                  marginLeft="4px"
                  marginBottom="2px"
                  display="flex"
                  alignItems="flex-end"
                >
                  <Box fontSize="0.8rem" marginRight="10px">
                    最終日: {dayjs(lastActivity.date).format('YYYY/MM/DD')}
                  </Box>
                  <Box fontSize="0.8rem">
                    ({dayjs(new Date()).diff(lastActivity.date, 'days')}
                    日前)
                  </Box>
                </Box>
              }
            />
          ) : (
            <Box>
              <Box
                fontSize="1rem"
                marginLeft="4px"
                marginBottom="2px"
                display="flex"
                alignItems="flex-end"
              >
                <Box fontSize="0.8rem" marginRight="10px">
                  最終日 ----/--/--
                </Box>
                <Box fontSize="0.8rem">(-日前)</Box>
              </Box>
              <BaseCard></BaseCard>
            </Box>
          )}
        </SectionContainer>
        <SectionContainer>
          <TransitionGroup>
            {records.map((record, i, records) => (
              <Collapse
                key={record.id}
                sx={{ scrollSnapAlign: 'start', marginBottom: '5px' }}
                ref={
                  records.length - 1 === i
                    ? lastRecordRef
                    : selectedRecordIndex === i
                    ? selectedRecordRef
                    : null
                }
                onClick={() => {
                  setSelectedRecordIndex(i);
                }}
              >
                <DeleteSlideAction onDeleteClick={() => deleteRecord(i)}>
                  <RecordCard
                    record={record}
                    isDisabled={isProcessing}
                    loadUnit={trainingEvent?.loadUnit ?? ''}
                    valueUnit={trainingEvent?.valueUnit ?? ''}
                    label={<div>{i + 1}セット目</div>}
                    isError={errorRecordIndex == i}
                    loadOnChange={(e) => {
                      const { value: input } = e.target as any;
                      setRecord(
                        {
                          ...record,
                          load: input ? parseFloat(input) : '',
                        },
                        i
                      );
                    }}
                    valueOnChange={(e) => {
                      const { value: input } = e.target as any;
                      setRecord(
                        {
                          ...record,
                          value: input ? parseFloat(input) : '',
                        },
                        i
                      );
                    }}
                    noteOnChange={(e) => {
                      const { value } = e.target as any;
                      setRecord({ ...record, note: value }, i);
                    }}
                  />
                </DeleteSlideAction>
              </Collapse>
            ))}
          </TransitionGroup>
        </SectionContainer>
      </Box>
      <Box display="flex" padding="20px 0 0" gap="20px">
        <SecondaryButton
          onClick={() => startProcessing(discard)}
          disabled={isProcessing}
        >
          破棄する
        </SecondaryButton>
        <PrimaryButton
          onClick={save}
          disabled={isLoading || isError || isProcessing}
          isLoading={isProcessing}
        >
          登録する
        </PrimaryButton>
      </Box>
      <Box position="fixed" bottom="100px" right="30px">
        <AddButton
          onClick={() => {
            lastRecordRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            addNewRecord();
          }}
          disabled={records.length >= Activity.RECORDS_MAX_LENGTH}
        />
      </Box>
    </PageContainer>
  );
};

export default RecordEditPage;
