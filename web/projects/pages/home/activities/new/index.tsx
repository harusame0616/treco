import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import BaseProgress from '../../../../components/base/base-progress';
import AddButton from '../../../../components/case/add-button';
import ListItemCard from '../../../../components/case/list-item-card';
import SecondaryButton from '../../../../components/case/secondary-button';
import ListContainer from '../../../../components/container/list-container';
import PageContainer from '../../../../components/container/page-container';
import SectionContainer from '../../../../components/container/section-container';
import CategoryLabel from '../../../../components/domain/category-label';
import CategoryEditPopup, {
  CategoryEditInfo,
} from '../../../../components/domain/category/category-edit-popup';
import { FSCategoryRepository } from '../../../../contexts/record/infrastructure/repository/fs-category-repository';
import { CategoryCommandUsecase } from '../../../../contexts/record/usecases/category-command-usecase';
import useCategories from '../../../../hooks/useCategories';
import { AuthContext, PopMessageContext } from '../../../_app';

const categoryCommandUsecase = new CategoryCommandUsecase({
  categoryRepository: new FSCategoryRepository(),
});

const ActivitiesNew = () => {
  const auth = useContext(AuthContext);
  const popMessage = useContext(PopMessageContext);

  const [categoryEditPopup, setCategoryEditPopup] = useState(false);

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

  const createNewCategory = async (
    data: CategoryEditInfo,
    reset: () => void
  ) => {
    if (
      categories
        .map((category) => category.categoryName)
        .includes(data.categoryName)
    ) {
      return popMessage?.('同じ名前のカテゴリが登録済みです。', {
        mode: 'error',
      });
    }

    categoryCommandUsecase.createNewCategory({
      userId: auth!.auth!.authId as string,
      ...data,
    });

    setCategoryEditPopup(false);
    reset();
  };

  return (
    <>
      <PageContainer>
        <SectionContainer>
          記録するカテゴリを選択してください。
        </SectionContainer>
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
      <CategoryEditPopup
        open={categoryEditPopup}
        onPirmaryClick={createNewCategory}
        onSecondaryClick={(_, reset) => {
          setCategoryEditPopup(false);
          reset();
        }}
      />
      <Box position="fixed" right="20px" bottom="20px" zIndex="1">
        <AddButton
          onClick={() => {
            setCategoryEditPopup(true);
          }}
        />
      </Box>
    </>
  );
};

export default ActivitiesNew;
