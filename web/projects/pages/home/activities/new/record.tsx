import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import AddButton from '../../../../components/case/add-button';
import PrimaryButton from '../../../../components/case/primary-button';
import SecondaryButton from '../../../../components/case/secondary-button';
import ListContainer from '../../../../components/container/list-container';
import PageContainer from '../../../../components/container/page-container';
import SectionContainer from '../../../../components/container/section-container';
import CategoryLabel from '../../../../components/domain/category-label';
import RecordCard from '../../../../components/domain/record-card';
import useActivityCreate from '../../../../hooks/useActivityCreate';
import useProcessing from '../../../../hooks/useProcessing';
import { AuthContext, PopMessageContext, TitleContext } from '../../../_app';

const NewRecord = () => {
  const router = useRouter();
  const { setTitle } = useContext(TitleContext);

  const auth = useContext(AuthContext);
  const popMessage = useContext(PopMessageContext);
  const { isProcessing, startProcessing } = useProcessing();
  const lastRecordRef = useRef<HTMLElement | null>(null);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const selectedRecordRef = useRef<HTMLElement | null>(null);

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
    userId: auth?.auth?.authId,
    categoryId: router.query['categoryId'] as string,
    trainingEventId: router.query['trainingEventId'] as string,
    activityId: router.query['activityId'] as string,
    date: new Date(router.query['date'] as string),
  });

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

  const goBack = async () => {
    await router.push({
      pathname: router.query.returnTo as string,
      query:
        typeof router.query.returnQuery === 'string'
          ? JSON.parse(router.query.returnQuery)
          : undefined,
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
              {isLoading
                ? '読み込み中'
                : trainingEvent?.categoryName ??
                  'トレーニング種目読み込みエラー'}
            </CategoryLabel>
            <Box>&gt;</Box> <Box>{trainingEvent?.trainingEventName}</Box>{' '}
          </Box>
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
