import { AuthContext, PopMessageContext, TitleContext } from '@/pages/_app';
import BaseProgress from '@Components/base/base-progress';
import AddButton from '@Components/case/add-button';
import DeleteConfirmDialog from '@Components/case/delete-confirm-dialog';
import DeleteSlideAction from '@Components/case/delete-slide-action';
import ListItemCard from '@Components/case/list-item-card';
import SecondaryButton from '@Components/case/secondary-button';
import PageContainer from '@Components/container/page-container';
import SectionContainer from '@Components/container/section-container';
import CategoryLabel from '@Components/domain/category-label';
import CategoryEditPopup, {
  CategoryEditInfo,
} from '@Components/domain/category/category-edit-dialog';
import { CategoryDto } from '@Domains/category/category';
import useCategories from '@Hooks/useCategories';
import useDialog from '@Hooks/useDialog';
import { EditRounded } from '@mui/icons-material';
import { Box, Collapse, IconButton } from '@mui/material';
import { FSCategoryRepository } from '@Repositories/fs-category-repository';
import { FSTrainigEventRepository } from '@Repositories/fs-training-event-repository';
import { CategoryCommandUsecase } from '@Usecases/category-command-usecase';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

const categoryCommandUsecase = new CategoryCommandUsecase({
  categoryRepository: new FSCategoryRepository(),
  trainingEventRepository: new FSTrainigEventRepository(),
});

const ActivitiesNew = () => {
  const auth = useContext(AuthContext);
  const popMessage = useContext(PopMessageContext);
  const { setTitle, setClickListener } = useContext(TitleContext);

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
    setClickListener?.(() => {
      router.push({
        pathname: '/home/',
        query: router.query,
      });
    });
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
            <TransitionGroup>
              {categories.map((category) => (
                <Collapse
                  key={category.categoryId}
                  sx={{ marginBottom: '5px' }}
                >
                  <DeleteSlideAction
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
                </Collapse>
              ))}
            </TransitionGroup>
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
