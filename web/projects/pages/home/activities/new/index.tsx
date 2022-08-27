import { EditRounded } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
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
import { CategoryDto } from '../../../../contexts/record/domains/category/category';
import { FSCategoryRepository } from '../../../../contexts/record/infrastructure/repository/fs-category-repository';
import { FSTrainigEventRepository } from '../../../../contexts/record/infrastructure/repository/fs-training-event-repository';
import { CategoryCommandUsecase } from '../../../../contexts/record/usecases/category-command-usecase';
import useCategories from '../../../../hooks/useCategories';
import { AuthContext, PopMessageContext, TitleContext } from '../../../_app';

const categoryCommandUsecase = new CategoryCommandUsecase({
  categoryRepository: new FSCategoryRepository(),
  trainingEventRepository: new FSTrainigEventRepository(),
});

const ActivitiesNew = () => {
  const auth = useContext(AuthContext);
  const popMessage = useContext(PopMessageContext);
  const { setTitle } = useContext(TitleContext);

  const [categoryEditPopup, setCategoryEditPopup] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<
    CategoryDto | undefined
  >();

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

  const saveCategory = (data: CategoryEditInfo, reset: () => void) => {
    console.log({ selectedCategory });
    if (selectedCategory) {
      editCategory({ ...selectedCategory, ...data });
    } else {
      createNewCategory(data);
    }

    setCategoryEditPopup(false);
    reset();
  };

  const createNewCategory = async (data: CategoryEditInfo) => {
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
  };

  const editCategory = (category: CategoryDto) => {
    if (
      categories
        .filter((category) => category.categoryId != category.categoryId)
        .map((category) => category.categoryName)
        .includes(category.categoryName)
    ) {
      return popMessage?.('同じ名前のカテゴリが登録済みです。', {
        mode: 'error',
      });
    }

    categoryCommandUsecase.editCategory(category);
  };

  const openCategoryEditPopup = (category?: CategoryDto) => {
    setSelectedCategory(category);
    setCategoryEditPopup(true);
  };

  const popupError = (e: Error) => {
    popMessage?.(e.message, { mode: 'error' });
  };

  useEffect(() => {
    const dateQuery = router.query.date;
    if (typeof dateQuery != 'string') {
      return;
    }

    setTitle?.(dayjs(dateQuery).format('YYYY-MM-DD'));
  }, [router.query.date]);

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
                  <Box flexGrow={1} flexShrink={0}>
                    <CategoryLabel color={category.color} size="large">
                      {category.categoryName}
                    </CategoryLabel>
                  </Box>
                  <Box flexGrow={0} flexShrink={1}>
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCategoryEditPopup(category);
                      }}
                    >
                      <EditRounded />
                    </IconButton>
                  </Box>
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
        category={selectedCategory}
        onPirmaryClick={saveCategory}
        onSecondaryClick={(_, reset) => {
          setCategoryEditPopup(false);
          reset();
        }}
        onError={popupError}
      />
      <Box position="fixed" right="20px" bottom="20px" zIndex="1">
        <AddButton onClick={() => openCategoryEditPopup()} />
      </Box>
    </>
  );
};

export default ActivitiesNew;
