import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import BaseProgress from '../../../../components/base/base-progress';
import ListItemCard from '../../../../components/case/list-item-card';
import SecondaryButton from '../../../../components/case/secondary-button';
import ListContainer from '../../../../components/container/list-container';
import PageContainer from '../../../../components/container/page-container';
import SectionContainer from '../../../../components/container/section-container';
import CategoryLabel from '../../../../components/domain/category-label';
import useCategory from '../../../../hooks/useCategory';
import useTrainingEvents from '../../../../hooks/useTrainingEvents';
import { AuthContext } from '../../../_app';

const NewEvent = () => {
  const router = useRouter();
  const categoryId = router.query['categoryId'];
  const auth = useContext(AuthContext);

  const { isLoading, trainingEvents, isError } = useTrainingEvents({
    categoryId: categoryId as string,
    userId: auth?.auth?.authId,
  });

  const { isLoading: categoryIsLoading, category } = useCategory({
    categoryId: categoryId as string,
    userId: auth?.auth?.authId,
  });

  const goToBack = () => {
    router.push({
      pathname: '/home/activities/new',
      query: router.query,
    });
  };

  const goToNext = async (eventId: string) => {
    await router.push({
      pathname: '/home/activities/new/record',
      query: {
        ...router.query,
        eventId,
      },
    });
  };

  return (
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
                  <ListItemCard
                    onClick={() => goToNext(event.trainingEventId)}
                    key={event.trainingEventId}
                  >
                    {event.trainingEventName}
                  </ListItemCard>
                ))
              : 'トレーニング種目読み込みエラー'}
          </ListContainer>
        )}
      </SectionContainer>

      <SectionContainer>
        <SecondaryButton onClick={goToBack}>カテゴリ選択に戻る</SecondaryButton>
      </SectionContainer>
    </PageContainer>
  );
};

export default NewEvent;
