import { PageInjection } from '@/pages/_app';
import BaseProgress from '@Components/base/base-progress';
import AddButton from '@Components/case/add-button';
import CenteredProgress from '@Components/case/centered-progress';
import DeleteConfirmDialog from '@Components/case/delete-confirm-dialog';
import DeleteSlideAction from '@Components/case/delete-slide-action';
import ListItemCard from '@Components/case/list-item-card';
import ReadErrorTemplate from '@Components/case/read-error-template';
import SecondaryButton from '@Components/case/secondary-button';
import PageContainer from '@Components/container/page-container';
import SectionContainer from '@Components/container/section-container';
import CategoryLabel from '@Components/domain/category-label';
import CategoryEditPopup, {
  CategoryEditInfo,
} from '@Components/domain/category/category-edit-dialog';
import { CategoryDto } from '@Domains/category/category';
import useCategories from '@Hooks/category/useCategories';
import useDialog from '@Hooks/useDialog';
import useProcessing from '@Hooks/useProcessing';
import { EditRounded } from '@mui/icons-material';
import { Box, Collapse, IconButton } from '@mui/material';
import { FSCategoryRepository } from '@Repositories/fs-category-repository';
import { FSTrainigEventRepository } from '@Repositories/fs-training-event-repository';
import { CategoryCommandUsecase } from '@Usecases/category-command-usecase';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

const categoryCommandUsecase = new CategoryCommandUsecase({
  categoryRepository: new FSCategoryRepository(),
  trainingEventRepository: new FSTrainigEventRepository(),
});

const CategoriesPage: NextPage<PageInjection> = ({
  auth,
  popMessage,
  pageTitle,
}) => {
  const { close, open, isOpen } = useDialog();
  const {
    close: categoryEditPopupClose,
    open: categoryEditPopupOpen,
    isOpen: categoryEditPopupIsOpen,
  } = useDialog();

  const [selectedCategory, setSelectedCategory] = useState<
    CategoryDto | undefined
  >();

  const { categories, isLoading, isError, refresh, error } = useCategories({
    userId: auth.auth.authId,
  });
  const { isProcessing, startProcessing } = useProcessing();

  const router = useRouter();

  useEffect(() => {
    const dateQuery = router.query.date;
    if (typeof dateQuery != 'string') {
      return;
    }

    pageTitle.setTitle(dayjs(dateQuery).format('YYYY-MM-DD'));
    pageTitle.setClickListener(() => {
      router.push({
        pathname: '/home/',
        query: router.query,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.date]);

  if (isLoading) {
    return <CenteredProgress />;
  }

  if (isError) {
    console.error(error);
    return <ReadErrorTemplate />;
  }

  const backHome = () => {
    router.push({
      pathname: '/home',
      query: {
        date: router.query.date,
      },
    });
  };

  const goToEventSelect = async (categoryId: string) => {
    await router.push({
      pathname: '/home/categories/training-event',
      query: {
        ...router.query,
        categoryId,
      },
    });
  };

  const saveCategory = async (data: CategoryEditInfo, reset: () => void) => {
    await startProcessing(async () => {
      try {
        if (selectedCategory) {
          await categoryCommandUsecase.editCategory({
            ...selectedCategory,
            ...data,
          });
        } else {
          await categoryCommandUsecase.createNewCategory({
            userId: auth.auth.authId as string,
            ...data,
          });
        }

        await refresh();
        categoryEditPopupClose();
      } catch (err: any) {
        popMessage.error(err);
      }
    });
  };

  const openCategoryEditPopup = (category?: CategoryDto) => {
    setSelectedCategory(category);
    categoryEditPopupOpen();
  };
  const openDeleteConfirm = (category: CategoryDto) => {
    setSelectedCategory(category);
    open();
  };

  const deleteCategory = async () => {
    await startProcessing(async () => {
      try {
        if (!selectedCategory) {
          throw new Error('カテゴリが選択されていません。');
        }

        await categoryCommandUsecase.deleteCategory(selectedCategory);
        await refresh();
        close();
      } catch (err: any) {
        popMessage.error(err);
      }
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
          <TransitionGroup>
            {categories.map((category) => (
              <Collapse
                key={category.categoryId}
                sx={{ marginBottom: '5px' }}
                className={`category-item category-item-${category.categoryName}`}
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
                      <CategoryLabel color={category.color} size="medium">
                        {category.categoryName}
                      </CategoryLabel>
                    </Box>
                    <Box
                      flexGrow={0}
                      flexShrink={1}
                      className="edit-button-container"
                    >
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
        <SecondaryButton onClick={backHome}>ホームへ戻る</SecondaryButton>
      </SectionContainer>
      <DeleteConfirmDialog
        open={isOpen}
        onPrimaryClick={deleteCategory}
        onSecondaryClick={close}
        isLoading={isProcessing}
      />
      <CategoryEditPopup
        open={categoryEditPopupIsOpen}
        category={selectedCategory}
        onPirmaryClick={saveCategory}
        onSecondaryClick={(_, reset) => {
          categoryEditPopupClose();
          reset();
        }}
        onError={(err) => popMessage.error(err)}
        isLoading={isProcessing}
      />
      <Box
        position="fixed"
        right="20px"
        bottom="60px"
        zIndex="1"
        className="new-category-button-container"
      >
        <AddButton onClick={() => openCategoryEditPopup()} />
      </Box>
    </PageContainer>
  );
};

export default CategoriesPage;
