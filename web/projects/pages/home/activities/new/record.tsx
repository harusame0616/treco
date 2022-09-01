import {
  ArrowForwardIosRounded,
  DeleteForeverRounded
} from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import AddButton from '../../../../components/case/add-button';
import DeleteConfirmDialog from '../../../../components/case/delete-confirm-dialog';
import PrimaryButton from '../../../../components/case/primary-button';
import SecondaryButton from '../../../../components/case/secondary-button';
import ListContainer from '../../../../components/container/list-container';
import PageContainer from '../../../../components/container/page-container';
import SectionContainer from '../../../../components/container/section-container';
import ActivityListItem from '../../../../components/domain/activity-list-item';
import CategoryLabel from '../../../../components/domain/category-label';
import RecordCard from '../../../../components/domain/record-card';
import { Activity } from '../../../../contexts/record/domains/activity/activity';
import useActivityCreate from '../../../../hooks/useActivityCreate';
import useActivityDelete from '../../../../hooks/useActivityDelete';
import useActivityOfLastTrainingEvent from '../../../../hooks/useActivityOfLastTrainingEvent';
import useDialog from '../../../../hooks/useDialog';
import useProcessing from '../../../../hooks/useProcessing';
import { AuthContext, PopMessageContext, TitleContext } from '../../../_app';

const NewRecord = () => {
  const auth = useContext(AuthContext);
  const { setTitle } = useContext(TitleContext);

  const router = useRouter();

  const { isOpen, open, close } = useDialog();

  const apiProp = useMemo(
    () => ({
      userId: auth?.auth?.authId,
      categoryId: router.query['categoryId'] as string,
      trainingEventId: router.query['trainingEventId'] as string,
      activityId: router.query['activityId'] as string,
    }),
    [router.query, auth?.auth.authId]
  );

  const popMessage = useContext(PopMessageContext);
  const { isProcessing, startProcessing } = useProcessing();
  const lastRecordRef = useRef<HTMLElement | null>(null);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const selectedRecordRef = useRef<HTMLElement | null>(null);
  const { activity: lastActivity } = useActivityOfLastTrainingEvent(apiProp);

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
  } = useActivityCreate({
    ...apiProp,
    date: new Date(router.query['date'] as string),
  });
  const activityDelete = useActivityDelete();

  const [stopFollowRecordCard, setStopFollowRecordCard] = useState(true);

  useEffect(() => {
    if (isLoading || stopFollowRecordCard) {
      return;
    }

    lastRecordRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [records.length]);

  useEffect(() => {
    // 初回のレンダリング時にスクロールしてしまうのを防ぐ
    setStopFollowRecordCard(false);
  }, []);

  useEffect(() => {
    if (typeof router.query.date !== 'string') {
      return;
    }

    setTitle?.(dayjs(router.query.date).format('YYYY-MM-DD'));
  }, [router.query.date]);

  useEffect(() => {
    if (selectedRecordIndex - 1 === records.length) {
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
  }, [selectedRecordIndex]);

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

  const discard = () => {
    goBack();
  };

  const save = async () => {
    try {
      await startProcessing(register());
    } catch (err: any) {
      return popMessage!(err.message, { mode: 'error' });
    }

    goBack();
  };

  const deleteActivity = useCallback(() => {
    activityDelete.deleteActivity({
      ...(router.query as any),
      userId: auth?.auth?.authId,
    });
    close();
    popMessage!('アクティビティを削除しました。');
    goBack({ query: { deleteActivityId: apiProp.activityId } });
  }, []);

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
              {isLoading ? (
                '読み込み中'
              ) : trainingEvent?.categoryName ? (
                <Box display="flex" width="100%">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap="5px"
                    flexGrow="1"
                  >
                    {trainingEvent.categoryName}{' '}
                    <ArrowForwardIosRounded sx={{ fontSize: '0.8rem' }} />
                    {trainingEvent?.trainingEventName}{' '}
                  </Box>
                  <Box flexGrow="0">
                    {router.query.activityId ? (
                      <IconButton color="primary" onClick={open}>
                        <DeleteForeverRounded />
                      </IconButton>
                    ) : undefined}
                  </Box>
                </Box>
              ) : (
                'トレーニング種目読み込みエラー'
              )}
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
                    {dayjs(lastActivity.date).format('YYYY/MM/DD')}
                  </Box>
                  <Box fontSize="0.8rem">
                    ({dayjs(new Date()).diff(lastActivity.date, 'days')}
                    日前)
                  </Box>
                </Box>
              }
            />
          ) : undefined}
        </SectionContainer>
        <SectionContainer>
          <ListContainer>
            {records.map((record, i, records) => (
              <Box
                sx={{ scrollSnapAlign: 'start' }}
                key={i}
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
                <RecordCard
                  record={record}
                  loadUnit={trainingEvent?.loadUnit ?? ''}
                  valueUnit={trainingEvent?.valueUnit ?? ''}
                  label={<div>{i + 1}セット目</div>}
                  isError={errorRecordIndex == i}
                  onDeleteClick={() => deleteRecord(i)}
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
              </Box>
            ))}
          </ListContainer>
        </SectionContainer>
      </Box>
      <DeleteConfirmDialog
        open={isOpen}
        onPrimaryClick={deleteActivity}
        onSecondaryClick={close}
      />

      <Box display="flex" padding="20px 0 0" gap="20px">
        <SecondaryButton onClick={discard} disabled={isProcessing}>
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
          onClick={addNewRecord}
          disabled={records.length >= Activity.RECORDS_MAX_LENGTH}
        />
      </Box>
    </PageContainer>
  );
};

export default NewRecord;
