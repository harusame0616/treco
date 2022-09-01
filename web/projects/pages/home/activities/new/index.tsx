import { EditRounded } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import BaseProgress from '../../../../components/base/base-progress';
import AddButton from '../../../../components/case/add-button';
import DeleteConfirmDialog from '../../../../components/case/delete-confirm-dialog';
import DeleteSlideAction from '../../../../components/case/delete-slide-action';
import ListItemCard from '../../../../components/case/list-item-card';
import SecondaryButton from '../../../../components/case/secondary-button';
import ListContainer from '../../../../components/container/list-container';
import PageContainer from '../../../../components/container/page-container';
import SectionContainer from '../../../../components/container/section-container';
import CategoryLabel from '../../../../components/domain/category-label';
import CategoryEditPopup, {
  CategoryEditInfo,
} from '../../../../components/domain/category/category-edit-dialog';
import { CategoryDto } from '../../../../contexts/record/domains/category/category';
import { FSCategoryRepository } from '../../../../contexts/record/infrastructure/repository/fs-category-repository';
import { FSTrainigEventRepository } from '../../../../contexts/record/infrastructure/repository/fs-training-event-repository';
import { CategoryCommandUsecase } from '../../../../contexts/record/usecases/category-command-usecase';
import useCategories from '../../../../hooks/useCategories';
import useDialog from '../../../../hooks/useDialog';
import { AuthContext, PopMessageContext, TitleContext } from '../../../_app';

const categoryCommandUsecase = new CategoryCommandUsecase({
  categoryRepository: new FSCategoryRepository(),
  trainingEventRepository: new FSTrainigEventRepository(),
});

const ActivitiesNew = () => {
  const auth = useContext(AuthContext);
  const popMessage = useContext(PopMessageContext);
  const { setTitle } = useContext(TitleContext);

  const { close, open, isOpen } = useDialog();
  const [categoryEditPopup, setCategoryEditPopup] = useState(false);

  const [exceptCategories, setExceptCategories] = useState<CategoryDto[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<
    CategoryDto | undefined
  >();

  const { categories: _categories, isLoading } = useCategories({
    authId: auth?.auth?.authId,
  });

  // 削除ボタンを押してから実際に削除されて反映されるまでにラグがあるので、
  // 削除が実行された項目は除外して即座に反映しているように見せる
  const categories = useMemo(
    () =>
      _categories.filter(
        (category) =>
          !exceptCategories
            .map((category) => category.categoryId)
            .includes(category.categoryId)
      ),
    [_categories, exceptCategories]
  );
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
  const openDeleteConfirm = (category: CategoryDto) => {
    setSelectedCategory(category);
    open();
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

  const deleteCategory = () => {
    if (!selectedCategory) {
      throw new Error('カテゴリが選択されていません。');
    }
    categoryCommandUsecase.deleteCategory(selectedCategory);
    setExceptCategories([...exceptCategories, selectedCategory]);
    close();
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
                <DeleteSlideAction
                  key={category.categoryId}
                  onDeleteClick={() => {
                    openDeleteConfirm(category);
                  }}
                >
                  <ListItemCard
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
                </DeleteSlideAction>
              ))}
            </ListContainer>
          )}
          <Box sx={{ fontSize: '0.8rem', fontStyle: 'italic' }} marginTop="3px">
            ※ 項目を左にスワイプすると削除ボタンが表示されます
          </Box>
        </SectionContainer>
        <SectionContainer>
          <SecondaryButton onClick={backToHome}>ホームへ戻る</SecondaryButton>
        </SectionContainer>
      </PageContainer>
      <DeleteConfirmDialog
        open={isOpen}
        onPrimaryClick={deleteCategory}
        onSecondaryClick={close}
      />
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
