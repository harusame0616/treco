import { Box, Grid } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { memo, useMemo } from 'react';
import { ActivityColorsDateMap } from './training-calender';
import TrainingCalenderDay from './training-calender-day';
import TrainingCalenderWeekday, { WEEKDAYS } from './training-calender-weekday';

type ChangeSelectDateHandler = (date: Dayjs) => void | Promise<void>;

interface TrainingCalenderProp {
  month: Dayjs;
  selectDate: Dayjs;
  today: Dayjs;
  changeSelectDate: ChangeSelectDateHandler;
  activityColorsDateMap: ActivityColorsDateMap;
}

const TrainingCalenderMonth = memo(function _TrainingCalenderDay(
  prop: TrainingCalenderProp
) {
  const showDays = useMemo(() => {
    const firstDate = prop.month.startOf('month');
    const dayOfFirstDate = firstDate.day();
    const calenderStart = firstDate.subtract(dayOfFirstDate, 'day');
    return new Array(7 * 6)
      .fill(0)
      .map((_, index) => calenderStart.add(index, 'day'));
  }, [prop.month]);

  const selectDate = dayjs(prop.selectDate);

  return (
    <Box width="100%" padding={'10px'}>
      <Grid container columns={14}>
        {WEEKDAYS.map((weekday) => (
          <TrainingCalenderWeekday
            weekday={weekday}
            isActive={prop.today.day() == weekday}
            key={weekday}
          />
        ))}
        {showDays.map((showDate) => (
          <TrainingCalenderDay
            date={showDate}
            isToday={showDate.isSame(prop.today, 'day')}
            isInMonth={showDate.isSame(prop.month, 'month')}
            categoryColors={
              prop.activityColorsDateMap[showDate.format('YYYY-MM-DD')]
            }
            isSelected={selectDate.isSame(showDate, 'day')}
            onClick={prop.changeSelectDate}
            key={showDate.format('YYYY-MM-DD')}
          />
        ))}
      </Grid>
    </Box>
  );
});

export default TrainingCalenderMonth;
