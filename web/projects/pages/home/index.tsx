import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AddButton from '../../components/case/add-button';
import PageContainer from '../../components/container/page-container';
import ActivityListItem from '../../components/domain/activity-list-item';
import TrainingCalender, {
  ActivityColorsDateMap,
} from '../../components/domain/training-calender/training-calender';
import useActivities, { Activity } from '../../hooks/useActivities';
import useIsClient from '../../hooks/useIsClient';

const Home = () => {
  const today = dayjs();
  const [selectDate, setSelectDate] = useState(today.toDate());
  const [month, setMonth] = useState(today.toDate());
  const { activities } = useActivities(today.toDate());
  const { isClient } = useIsClient();
  const router = useRouter();

  const activitiesDateMap = activities.reduce((prev, activity) => {
    const key = dayjs(activity.date).format('YYYY-MM-DD');
    if (!prev[key]) {
      prev[key] = [];
    }
    prev[key].push(activity);

    return prev;
  }, {} as { [date: string]: Activity[] });

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
    activitiesDateMap[dayjs(selectDate).format('YYYY-MM-DD')] ?? [];

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
              today={today.toDate()}
              selectDate={selectDate}
              activityColorsDateMap={activityColorsDateMap}
              changeSelectDate={(date) => {
                setSelectDate(date);
              }}
              changeViewMonth={(date) => {
                setMonth(date);
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
            {selectDateActivities.map((activity) => (
              <ActivityListItem activity={activity} key={activity.activityId} />
            ))}
          </Box>
          <Box position="absolute" right="20px" bottom="20px">
            <AddButton
              onClick={() => {
                router.push({
                  pathname: '/home/activities/new',
                  query: {
                    date: dayjs(selectDate).toDate().toUTCString(),
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
