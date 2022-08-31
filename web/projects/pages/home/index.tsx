import { Box, ClickAwayListener } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import BaseProgress from '../../components/base/base-progress';
import AddButton from '../../components/case/add-button';
import PageContainer from '../../components/container/page-container';
import ActivityListItem from '../../components/domain/activity-list-item';
import TrainingCalender, {
  ActivityColorsDateMap,
} from '../../components/domain/training-calender/training-calender';
import { ActivityDto } from '../../contexts/record/domains/activity/activity';
import { ActivityWithCategoryAndTrainingEventDto } from '../../contexts/record/usecases/activity-query-usecase';
import useActivities from '../../hooks/useActivities';
import useIsClient from '../../hooks/useIsClient';
import { AuthContext, TitleContext } from '../_app';

const Home = () => {
  const auth = useContext(AuthContext);
  const { setTitle, setClickListener } = useContext(TitleContext);
  const router = useRouter();

  const [today] = useState(dayjs());
  const [selectDate, setSelectDate] = useState(
    typeof router.query['date'] == 'string'
      ? dayjs(router.query['date'])
      : today
  );
  const [month, setMonth] = useState(selectDate);

  const selectDateMonth = selectDate.startOf('month').toDate();
  const viewCurrentMonth = month.startOf('month').toDate();
  const viewPrevMonth = month.startOf('month').add(-1, 'month').toDate();
  const viewNextMonth = month.startOf('month').add(1, 'month').toDate();

  const {
    activities: selectDateMonthActivities,
    isLoading: selectDateMonthActivitiesIsLoading,
  } = useActivities({
    userId: auth?.auth.authId,
    month: selectDateMonth,
  });

  const { activities: currentMonthActivities } = useActivities({
    userId: auth?.auth.authId,
    month: viewCurrentMonth,
  });

  const { activities: prevMonthActivities } = useActivities({
    userId: auth?.auth.authId,
    month: viewPrevMonth,
  });

  const { activities: nextMonthActivities } = useActivities({
    userId: auth?.auth.authId,
    month: viewNextMonth,
  });

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
  ].filter(
    // 他ページでアクティビティを削除後、遷移してきた時に削除される前に一覧を取得してしまうため、削除したアクティビティは除外
    (activity) => activity.activityId != router.query.deleteActivityId
  );
  const { isClient } = useIsClient();

  const changeSelectDate = useCallback(
    (date: Dayjs) => {
      setSelectDate(date);
    },
    [setSelectDate]
  );

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
      pathname: '/home/activities/new/record',
      query: {
        categoryId: activity.categoryId,
        trainingEventId: activity.trainingEventId,
        activityId: activity.activityId,
        returnTo: `/home`,
        returnQuery: JSON.stringify({
          date: selectDate.toDate().toUTCString(),
        }),
      },
    });
  };

  useEffect(() => {
    if (!setTitle) {
      return;
    }

    setTitle(month.format('YYYY-MM'));
  }, [month, setTitle]);

  useEffect(() => {
    setClickListener?.(() => {
      setMonth(dayjs().startOf('month'));
      changeSelectDate(dayjs());
    });
  }, [setClickListener]);

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
            height="0px"
            display="flex"
            flexDirection="column"
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
              selectDateActivities.map((activity) => (
                <ActivityListItem
                  activity={activity}
                  key={activity.activityId}
                  onClick={goToActivityEdit}
                />
              ))
            )}
          </Box>
          <Box position="absolute" right="20px" bottom="20px" zIndex="1">
            <AddButton
              onClick={() => {
                router.push({
                  pathname: '/home/activities/new',
                  query: {
                    date: selectDate.toDate().toUTCString(),
                  },
                });
              }}
            />
          </Box>
        </>
      ) : undefined}
    </PageContainer>
  );
};

export default Home;
