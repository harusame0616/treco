import { PageInjection } from '@/pages/_app';
import AddButton from '@Components/case/add-button';
import CenteredProgress from '@Components/case/centered-progress';
import DeleteConfirmDialog from '@Components/case/delete-confirm-dialog';
import DeleteSlideAction from '@Components/case/delete-slide-action';
import ListItemCard from '@Components/case/list-item-card';
import ReadErrorTemplate from '@Components/case/read-error-template';
import SecondaryButton from '@Components/case/secondary-button';
import PageContainer from '@Components/container/page-container';
import SectionContainer from '@Components/container/section-container';
import TrainingMenuEditPopup from '@Components/domain/training-menu/training-menu-edit-popup';
import {
  TrainingMenuDto,
  TrainingMenuProperty,
} from '@Domains/training-menu/training-menu';
import { RequireError } from '@Errors/require-error';
import useTrainingMenus from '@Hooks/training-menu/useTrainingMenus';
import useDialog from '@Hooks/useDialog';
import useProcessing from '@Hooks/useProcessing';
import { EditRounded } from '@mui/icons-material';
import { Box, Collapse, IconButton } from '@mui/material';
import { FSTrainingMenuCollectionRepository } from '@Repositories/fs-training-menu-collection-repository';
import { TrainingMenuCollectionCommandUsecase } from '@Usecases/training-menu-collection-command-usecase';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

const trainingMenuCommandUsecase = new TrainingMenuCollectionCommandUsecase({
  trainingMenuCollectionRepository: new FSTrainingMenuCollectionRepository(),
});

const MenusIndex: NextPage<PageInjection> = ({
  popMessage,
  auth,
  pageTitle,
}) => {
  const router = useRouter();

  const { trainingMenus, isLoading, isError, refresh } = useTrainingMenus({
    userId: auth.auth.authId,
  });

  const { close, open, isOpen } = useDialog();
  const {
    close: closeEditPopup,
    open: openEditPopup,
    isOpen: editIsOpen,
  } = useDialog();

  const [selectedTrainingMenu, setSelectedTrainingMenu] = useState<
    TrainingMenuDto | undefined
  >();

  const { startProcessing, isProcessing } = useProcessing();

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
  }, [router.query.date]);

  if (isError) {
    return <ReadErrorTemplate />;
  }

  if (isLoading) {
    return <CenteredProgress />;
  }

  const saveTrainingMenu = async (
    data: Omit<TrainingMenuProperty, 'trainingEventIds'>,
    reset: () => void
  ) => {
    try {
      await startProcessing(async () => {
        if (!auth.auth.authId) {
          throw new RequireError('ユーザーID');
        }

        if (selectedTrainingMenu) {
          await trainingMenuCommandUsecase.editTrainingMenu({
            ...selectedTrainingMenu,
            ...data,
          });
        } else {
          await trainingMenuCommandUsecase.addTrainingMenu({
            userId: auth.auth.authId,
            ...data,
          });
        }

        refresh();
        closeEditPopup();
        reset();
      });
    } catch (err: any) {
      popMessage.error(err);
    }
  };

  const deleteTrainingMenu = async () => {
    try {
      await startProcessing(async () => {
        if (!selectedTrainingMenu) {
          throw new Error('カテゴリが選択されていません。');
        }

        await trainingMenuCommandUsecase.deleteTrainingMenu(
          selectedTrainingMenu
        );
        refresh();
        close();
      });
    } catch (err: any) {
      popMessage.error(err);
    }
  };

  const backToHome = () => {
    router.push({
      pathname: '/home',
      query: {
        date: router.query.date,
      },
    });
  };

  const goToEventSelect = async (trainingMenuId: string) => {
    await router.push({
      pathname: `/home/menus/${trainingMenuId}`,
      query: {
        ...router.query,
        trainingMenuId,
      },
    });
  };

  const openTrainingMenuPop = (trainingMenu?: TrainingMenuDto) => {
    setSelectedTrainingMenu(trainingMenu);
    openEditPopup();
  };
  const openDeleteConfirm = (trainingMenu: TrainingMenuDto) => {
    setSelectedTrainingMenu(trainingMenu);
    open();
  };

  return (
    <>
      <PageContainer>
        <SectionContainer>
          記録するトレーニングメニューを選択してください。
        </SectionContainer>
        <SectionContainer>
          <TransitionGroup>
            {trainingMenus.map((menu) => (
              <Collapse key={menu.trainingMenuId} sx={{ marginBottom: '5px' }}>
                <DeleteSlideAction
                  onDeleteClick={() => {
                    openDeleteConfirm(menu);
                  }}
                >
                  <ListItemCard
                    onClick={() => goToEventSelect(menu.trainingMenuId)}
                  >
                    <Box flexGrow={1}>
                      <Box
                        sx={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                        }}
                      >
                        {menu.name}
                      </Box>
                      <Box
                        fontSize="0.6em"
                        sx={{
                          color: '#aaa',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                        }}
                      >
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
        isLoading={isProcessing}
      />
      <TrainingMenuEditPopup
        open={editIsOpen}
        trainingMenu={selectedTrainingMenu}
        onPirmaryClick={saveTrainingMenu}
        onSecondaryClick={(_, reset) => {
          closeEditPopup();
          reset();
        }}
        onError={popMessage.error}
        isLoading={isProcessing}
      />
    </>
  );
};

export default MenusIndex;
