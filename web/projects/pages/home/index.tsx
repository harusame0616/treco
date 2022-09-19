import BaseCircleButton from '@Components/base/base-circle-button';
import BaseDatePicker from '@Components/base/base-month-picker';
import BaseProgress from '@Components/base/base-progress';
import AddButton from '@Components/case/add-button';
import DeleteConfirmDialog from '@Components/case/delete-confirm-dialog';
import DeleteSlideAction from '@Components/case/delete-slide-action';
import ReadErrorTemplate from '@Components/case/read-error-template';
import PageContainer from '@Components/container/page-container';
import ActivityListItem from '@Components/domain/activity-list-item';
import TrainingCalender, {
  ActivityColorsDateMap,
} from '@Components/domain/training-calender/training-calender';
import { ActivityDto } from '@Domains/activity/activity';
import useActivities from '@Hooks/activity/useActivities';
import useActivityDelete from '@Hooks/activity/useActivityDelete';
import useDialog from '@Hooks/useDialog';
import useIsClient from '@Hooks/useIsClient';
import useProcessing from '@Hooks/useProcessing';
import { FormatListBulletedRounded, ShareRounded } from '@mui/icons-material';
import { Box, Collapse } from '@mui/material';
import { ActivityWithCategoryAndTrainingEventDto } from '@Usecases/activity-query-usecase';
import dayjs, { Dayjs } from 'dayjs';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { PageInjection } from '../_app';

const Home: NextPage<PageInjection> = ({ auth, pageTitle, popMessage }) => {
  const router = useRouter();
  const activityDelete = useActivityDelete();

  const [today] = useState(dayjs());
  const [selectDate, setSelectDate] = useState(
    typeof router.query['date'] == 'string'
      ? dayjs(router.query['date'])
      : today
  );
  const [month, setMonth] = useState(selectDate);
  const { isProcessing, startProcessing } = useProcessing();

  const selectDateMonth = selectDate.startOf('month').toDate();
  const viewCurrentMonth = month.startOf('month').toDate();
  const viewPrevMonth = month.startOf('month').add(-1, 'month').toDate();
  const viewNextMonth = month.startOf('month').add(1, 'month').toDate();

  const {
    activities: selectDateMonthActivities,
    isLoading: selectDateMonthActivitiesIsLoading,
    isError: selectDateMonthActivitiesIsError,
    refresh: selectDateMonthActivitiesRefresh,
    error: selectDateMonthActivitiesError,
  } = useActivities({
    userId: auth?.auth.authId,
    month: selectDateMonth,
  });

  const {
    activities: currentMonthActivities,
    isLoading: currentMonthActivitiesIsLoading,
    isError: currentMonthActivitiesIsError,
    error: currentMonthActivitiesError,
  } = useActivities({
    userId: auth?.auth.authId,
    month: viewCurrentMonth,
  });

  const {
    activities: prevMonthActivities,
    isLoading: prevMonthActivitiesIsLoading,
    isError: prevMonthActivitiesIsError,
    error: prevMonthActivitiesError,
  } = useActivities({
    userId: auth?.auth.authId,
    month: viewPrevMonth,
  });

  const {
    activities: nextMonthActivities,
    isLoading: nextMonthActivitiesIsLoading,
    isError: nextMonthActivitiesIsError,
    error: nextMonthActivitiesError,
  } = useActivities({
    userId: auth?.auth.authId,
    month: viewNextMonth,
  });

  const [selectedActivity, setSelectedActivity] = useState<ActivityDto | null>(
    null
  );

  // selectDate の activities と重複しないように、
  // selectDate と同じ月の activities は集計しない
  const activities = [
    ...(dayjs(selectDateMonth).isSame(viewPrevMonth, 'month')
      ? []
      : prevMonthActivities ?? []),
    ...(dayjs(selectDateMonth).isSame(viewCurrentMonth, 'month')
      ? []
      : currentMonthActivities ?? []),
    ...(dayjs(selectDateMonth).isSame(viewNextMonth, 'month')
      ? []
      : nextMonthActivities ?? []),
    ...(selectDateMonthActivities ?? []),
  ];
  const { isClient } = useIsClient();

  const changeSelectDate = useCallback(
    (date: Dayjs) => {
      setSelectDate(date);
    },
    [setSelectDate]
  );
  const { isOpen, open, close } = useDialog();

  const activitiesDateMap = activities.reduce((prev, activity) => {
    const key = dayjs(activity.date).format('YYYY-MM-DD');
    if (!prev[key]) {
      prev[key] = [];
    }
    prev[key].push(activity);

    return prev;
  }, {} as { [date: string]: ActivityWithCategoryAndTrainingEventDto[] });

  const activityColorsDateMap: ActivityColorsDateMap = Object.fromEntries(
    Object.entries(activitiesDateMap).map(([key, activities]) => {
      // 同一色のトレーニングは一つにまとめる
      const activityColorAggregation = activities.reduce((prev, activity) => {
        prev.add(activity.color);
        return prev;
      }, new Set<string>());

      return [key, Array.from(activityColorAggregation)];
    })
  );

  const selectDateActivities =
    activitiesDateMap[selectDate.format('YYYY-MM-DD')] ?? [];

  const goToActivityEdit = (activity: ActivityDto) => {
    router.push({
      pathname: '/home/categories/record',
      query: {
        categoryId: activity.categoryId,
        trainingEventId: activity.trainingEventId,
        activityId: activity.activityId,
        returnTo: `/home`,
        date: selectDate.toDate().toUTCString(),
        returnQuery: JSON.stringify({
          date: selectDate.toDate().toUTCString(),
        }),
      },
    });
  };

  useEffect(() => {
    pageTitle.setTitle(
      <Box display="flex">
        <Box
          onClick={() => {
            setMonth(dayjs().startOf('month'));
            changeSelectDate(dayjs());
          }}
        >
          {month.format('YYYY-MM')}
        </Box>
        <Box sx={{ marginRight: '-40px', marginTop: '-2px' }}>
          <BaseDatePicker onChange={(month) => setMonth(month)} month={month} />
        </Box>
      </Box>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const isLoading =
    selectDateMonthActivitiesIsLoading ||
    prevMonthActivitiesIsLoading ||
    currentMonthActivitiesIsLoading ||
    nextMonthActivitiesIsLoading;

  if (
    selectDateMonthActivitiesIsError ||
    prevMonthActivitiesIsError ||
    currentMonthActivitiesIsError ||
    nextMonthActivitiesIsError
  ) {
    console.error({
      selectDateMonthActivitiesError,
      prevMonthActivitiesError,
      currentMonthActivitiesError,
      nextMonthActivitiesError,
    });
    return <ReadErrorTemplate />;
  }

  const deleteActivity = async () => {
    await startProcessing(async () => {
      try {
        if (!selectedActivity) {
          throw new Error('アクティビティが選択されていません。');
        }

        await activityDelete.deleteActivity(selectedActivity);
        selectDateMonthActivitiesRefresh?.();
        close();
      } catch (err: any) {
        popMessage.error(err);
      }
    });
  };

  const openDeleteConfirm = (activity: ActivityDto) => {
    setSelectedActivity(activity);
    open();
  };

  const canShare = 'share' in navigator;

  return (
    <PageContainer>
      {/* サーバーとクライアントでタイムゾーンが異なることにより、
          hydrationエラーが発生してしまうため、
          クライアントでのみカレンダー描画 */}
      {isClient ? (
        <>
          <Box
            flexGrow="0"
            flexShrink="0"
            sx={{ background: '#262626', margin: '-20px -20px 0' }}
          >
            <TrainingCalender
              month={month}
              today={today}
              selectDate={selectDate}
              activityColorsDateMap={activityColorsDateMap}
              changeSelectDate={changeSelectDate}
              changeViewMonth={(date) => {
                setMonth(dayjs(date));
              }}
            />
          </Box>
          <Box
            flexGrow="1"
            flexShrink="1"
            paddingY="20px"
            overflow="auto"
            gap="20px"
          >
            {selectDateMonthActivitiesIsLoading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                height="100%"
              >
                <BaseProgress />
              </Box>
            ) : (
              <TransitionGroup>
                {selectDateActivities.map((activity) => (
                  <Collapse
                    key={activity.activityId}
                    sx={{ marginBottom: '20px' }}
                  >
                    <DeleteSlideAction
                      onDeleteClick={() => openDeleteConfirm(activity)}
                    >
                      <ActivityListItem
                        activity={activity}
                        onClick={goToActivityEdit}
                      />
                    </DeleteSlideAction>
                  </Collapse>
                ))}
              </TransitionGroup>
            )}

            {(() => {
              if (selectDateActivities.length) {
                return (
                  <Box
                    fontSize="0.75rem"
                    sx={{ fontStyle: 'italic' }}
                    marginTop="-15px"
                  >
                    ※ 項目を左にスワイプすると削除ボタンが表示されます
                  </Box>
                );
              }
            })()}
          </Box>
        </>
      ) : undefined}
      <DeleteConfirmDialog
        open={isOpen}
        onPrimaryClick={deleteActivity}
        onSecondaryClick={close}
        isLoading={isProcessing}
      />
      {!canShare ? (
        <Box position="fixed" right="20px" bottom="160px" zIndex="1">
          <BaseCircleButton
            disabled={!activities?.length}
            onClick={() => {
              router.push(
                `/home/share?date=${selectDate.toDate().toUTCString()}`
              );
            }}
          >
            <ShareRounded />
          </BaseCircleButton>
        </Box>
      ) : undefined}
      <Box position="fixed" right="20px" bottom="110px" zIndex="1">
        <BaseCircleButton
          onClick={() => {
            router.push({
              pathname: '/home/menus/',
              query: { date: selectDate.toDate().toUTCString() },
            });
          }}
        >
          <FormatListBulletedRounded />
        </BaseCircleButton>
      </Box>
      <Box position="fixed" right="20px" bottom="60px" zIndex="1">
        <AddButton
          onClick={() => {
            router.push({
              pathname: '/home/categories',
              query: { date: selectDate.toDate().toUTCString() },
            });
          }}
        />
      </Box>
    </PageContainer>
  );
};

export default Home;
