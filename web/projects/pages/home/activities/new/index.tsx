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
import useCategories from '../../../../hooks/useCategories';
import { AuthContext } from '../../../_app';

const ActivitiesNew = () => {
  const auth = useContext(AuthContext);

  const { categories, isLoading } = useCategories({
    authId: auth?.auth?.authId,
  });
  const router = useRouter();

  const backToHome = () => {
    router.push({
      pathname: '/home',
      query: {
        date: router.query.date,
      },
    });
  };

  const goToEventSelect = async (categoryId: string) => {
    await router.push({
      pathname: '/home/activities/new/training-event',
      query: {
        ...router.query,
        categoryId,
      },
    });
  };

  return (
    <PageContainer>
      <SectionContainer>記録するカテゴリを選択してください。</SectionContainer>
      <SectionContainer>
        {isLoading ? (
          <Box display="flex" justifyContent="center">
            <BaseProgress />
          </Box>
        ) : (
          <ListContainer>
            {categories.map((category) => (
              <ListItemCard
                key={category.categoryId}
                onClick={() => goToEventSelect(category.categoryId)}
              >
                <CategoryLabel color={category.color} size="large">
                  {category.categoryName}
                </CategoryLabel>
              </ListItemCard>
            ))}
          </ListContainer>
        )}
      </SectionContainer>
      <SectionContainer>
        <SecondaryButton onClick={backToHome}>ホームへ戻る</SecondaryButton>
      </SectionContainer>
    </PageContainer>
  );
};

export default ActivitiesNew;
