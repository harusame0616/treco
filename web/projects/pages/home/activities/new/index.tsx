import { useRouter } from 'next/router';
import ListItemCard from '../../../../components/case/list-item-card';
import SecondaryButton from '../../../../components/case/secondary-button';
import ListContainer from '../../../../components/container/list-container';
import PageContainer from '../../../../components/container/page-container';
import SectionContainer from '../../../../components/container/section-container';
import CategoryLabel from '../../../../components/domain/category-label';
import useCategories from '../../../../hooks/useCategories';

const ActivitiesNew = () => {
  const { categories } = useCategories();
  const router = useRouter();

  const backToHome = () => {
    router.push({
      pathname: '/home',
      query: {
        date: router.query.date,
      },
    });
  };

  const goToEventSelect = async (categoryId: number) => {
    await router.push({
      pathname: '/home/activities/new/event',
      query: {
        ...router.query,
        categoryId,
      },
    });
  };

  return (
    <PageContainer>
      <SectionContainer>
        記録する種目のカテゴリを選択してください。
      </SectionContainer>
      <SectionContainer>
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
      </SectionContainer>
      <SectionContainer>
        <SecondaryButton onClick={backToHome}>ホームへ戻る</SecondaryButton>
      </SectionContainer>
    </PageContainer>
  );
};

export default ActivitiesNew;
