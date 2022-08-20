import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import PrimaryButton from '../../../../components/case/primary-button';
import SecondaryButton from '../../../../components/case/secondary-button';
import TextButton from '../../../../components/case/text-button';
import ListContainer from '../../../../components/container/list-container';
import PageContainer from '../../../../components/container/page-container';
import SectionContainer from '../../../../components/container/section-container';
import CategoryLabel from '../../../../components/domain/category-label';
import RecordCard from '../../../../components/domain/record-card';
import useCategory from '../../../../custom-error/useCategory';
import useActivityCreate from '../../../../hooks/useActivityCreate';
import { AuthContext } from '../../../_app';

const NewRecord = () => {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const { isLoading, category } = useCategory({
    userId: auth?.auth?.authId,
    categoryId: router.query['categoryId'] as string,
  });

  const { activity, setRecord, addNewRecord } = useActivityCreate({
    recordId: null,
  });

  const discard = () => {
    router.push({
      pathname: '/home/activities/new/training-event',
      query: {
        categoryId: activity.categoryId,
      },
    });
  };
  const save = () => {
    router.push({
      pathname: '/home/activities/new/training-event',
      query: {
        categoryId: activity.categoryId,
      },
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
          paddingBottom: '50vh',
        }}
        flexGrow="1"
        flexShrink="0"
      >
        <SectionContainer>
          <Box
            display="flex"
            gap="10px"
            sx={{ scrollSnapAlign: 'start' }}
            alignItems="center"
          >
            <CategoryLabel color={category?.color}>
              {isLoading
                ? '読み込み中'
                : category?.categoryName ?? 'カテゴリ読み込みエラー'}
            </CategoryLabel>
            <Box>&gt;</Box> <Box>ベンチプレス</Box>{' '}
          </Box>
        </SectionContainer>
        <SectionContainer>
          <ListContainer>
            {activity.records.map((record, i) => (
              <Box sx={{ scrollSnapAlign: 'start' }} key={i}>
                <RecordCard
                  record={record}
                  loadUnit={activity.loadUnit}
                  valueUnit={activity.valueUnit}
                  label={<div>{i + 1}セット目</div>}
                  loadOnChange={(e) => {
                    setRecord(
                      { ...record, load: parseFloat((e.target as any).value) },
                      i
                    );
                  }}
                  valueOnChange={(e) => {
                    setRecord(
                      { ...record, value: parseFloat((e.target as any).value) },
                      i
                    );
                  }}
                  noteOnChange={(e) => {
                    setRecord({ ...record, note: (e.target as any).value }, i);
                  }}
                />
              </Box>
            ))}
          </ListContainer>
        </SectionContainer>
        <TextButton onClick={addNewRecord}>新しいセットを追加する</TextButton>
      </Box>
      <Box display="flex" padding="20px 0 0" gap="20px">
        <SecondaryButton onClick={discard}>破棄する</SecondaryButton>
        <PrimaryButton onClick={save}>保存する</PrimaryButton>
      </Box>
    </PageContainer>
  );
};

export default NewRecord;
