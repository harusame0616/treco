import { AuthContext, PopMessageContext, TitleContext } from '@/pages/_app';
import BaseProgress from '@Components/base/base-progress';
import AddButton from '@Components/case/add-button';
import DeleteConfirmDialog from '@Components/case/delete-confirm-dialog';
import DeleteSlideAction from '@Components/case/delete-slide-action';
import ListItemCard from '@Components/case/list-item-card';
import SecondaryButton from '@Components/case/secondary-button';
import PageContainer from '@Components/container/page-container';
import SectionContainer from '@Components/container/section-container';
import TrainingMenuEditPopup from '@Components/domain/training-menu/training-menu-edit-popup';
import {
  TrainingMenuDto,
  TrainingMenuProperty,
} from '@Domains/training-menu/training-menu';
import { TrainingMenuCollection } from '@Domains/training-menu/training-menu-collection';
import useTrainingMenus from '@Hooks/training-menu/useTrainingMenus';
import useDialog from '@Hooks/useDialog';
import { EditRounded } from '@mui/icons-material';
import { Box, Collapse, IconButton } from '@mui/material';
import { FSTrainingMenuRepository } from '@Repositories/fs-training-menu-collection-repository';
import { TrainingMenuCollectionUsecase } from '@Usecases/training-menu-collection-usecase';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

const trainingMenuCommandUsecase = new TrainingMenuCollectionUsecase({
  trainingMenuCollectionRepository: new FSTrainingMenuRepository(),
});

const MenusIndex = () => {
  const auth = useContext(AuthContext);
  const popMessage = useContext(PopMessageContext);
  const { setTitle, setClickListener } = useContext(TitleContext);

  const { trainingMenus: _trainingMenus, isLoading } = useTrainingMenus({
    userId: auth?.auth?.authId,
  });

  const { close, open, isOpen } = useDialog();
  const {
    close: closeEditPopup,
    open: openEditPopup,
    isOpen: editIsOpen,
  } = useDialog();

  const [exceptItems, setExceptItems] = useState<TrainingMenuDto[]>([]);

  const [selectedTrainingMenu, setSelectedTrainingMenu] = useState<
    TrainingMenuDto | undefined
  >();

  // 削除ボタンを押してから実際に削除されて反映されるまでにラグがあるので、
  // 削除が実行された項目は除外して即座に反映しているように見せる
  const menus = useMemo(
    () =>
      _trainingMenus.filter(
        (menu: TrainingMenuDto) =>
          !exceptItems
            .map((item) => item.trainingMenuId)
            .includes(menu.trainingMenuId)
      ),
    [_trainingMenus, exceptItems]
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
      pathname: '/home/menus/training-events',
      query: {
        ...router.query,
        categoryId,
      },
    });
  };

  const saveTrainingMenu = (data: TrainingMenuProperty, reset: () => void) => {
    if (selectedTrainingMenu) {
      editTrainingMenu({ ...selectedTrainingMenu, ...data });
    } else {
      createTrainingMenu(data);
    }

    closeEditPopup();
    reset();
  };

  const createTrainingMenu = async (data: TrainingMenuProperty) => {
    if (menus.length >= TrainingMenuCollection.TRAINING_MENUS_MAX_LENGTH) {
      return popMessage?.('トレーニングメニューの最大登録数を超えています。', {
        mode: 'error',
      });
    }
    if (menus.map((menu) => menu.name).includes(data.name)) {
      return popMessage?.('同じ名前のトレーニングメニュー名が登録済みです。', {
        mode: 'error',
      });
    }

    trainingMenuCommandUsecase.addTrainingMenu({
      userId: auth!.auth!.authId as string,
      ...data,
    });
  };

  const editTrainingMenu = (trainingMenu: TrainingMenuDto) => {
    if (
      menus
        .filter((menu) => menu.trainingMenuId != trainingMenu.trainingMenuId)
        .map(({ name }) => name)
        .includes(trainingMenu.name)
    ) {
      return popMessage?.('同じ名前のトレーニング名が登録済みです。', {
        mode: 'error',
      });
    }
    trainingMenuCommandUsecase.editTrainingMenu(trainingMenu);
  };

  const openTrainingMenuPop = (trainingMenu?: TrainingMenuDto) => {
    setSelectedTrainingMenu(trainingMenu);
    openEditPopup();
  };
  const openDeleteConfirm = (trainingMenu: TrainingMenuDto) => {
    setSelectedTrainingMenu(trainingMenu);
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

  const deleteTrainingMenu = () => {
    if (!selectedTrainingMenu) {
      throw new Error('カテゴリが選択されていません。');
    }
    trainingMenuCommandUsecase.deleteTrainingMenu(selectedTrainingMenu);
    setExceptItems([...exceptItems, selectedTrainingMenu]);
    close();
  };

  return (
    <>
      <PageContainer>
        <SectionContainer>
          記録するトレーニングメニューを選択してください。
        </SectionContainer>
        <SectionContainer>
          {isLoading ? (
            <Box display="flex" justifyContent="center">
              <BaseProgress />
            </Box>
          ) : (
            <TransitionGroup>
              {menus.map((menu) => (
                <Collapse
                  key={menu.trainingMenuId}
                  sx={{ marginBottom: '5px' }}
                >
                  <DeleteSlideAction
                    onDeleteClick={() => {
                      openDeleteConfirm(menu);
                    }}
                  >
                    <ListItemCard
                      onClick={() => goToEventSelect(menu.trainingMenuId)}
                    >
                      <Box flexGrow={1} flexShrink={0}>
                        <Box>{menu.name}</Box>
                        <Box fontSize="0.85rem" sx={{ color: '#aaa' }}>
                          {menu.note}
                        </Box>
                      </Box>
                      <Box flexGrow={0} flexShrink={1}>
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openTrainingMenuPop(menu);
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
        <Box position="fixed" right="20px" bottom="20px" zIndex="1">
          <AddButton onClick={() => openTrainingMenuPop()} />
        </Box>
      </PageContainer>
      <DeleteConfirmDialog
        open={isOpen}
        onPrimaryClick={deleteTrainingMenu}
        onSecondaryClick={close}
      />
      <TrainingMenuEditPopup
        open={editIsOpen}
        trainingMenu={selectedTrainingMenu}
        onPirmaryClick={saveTrainingMenu}
        onSecondaryClick={(_, reset) => {
          closeEditPopup();
          reset();
        }}
        onError={popupError}
      />
    </>
  );
};

export default MenusIndex;
