import { Box, Grid } from '@mui/material';
import dayjs from 'dayjs';
import TrainingMark from '../training-mark';
import { ActivityColorsDateMap } from './training-calender';

type ChangeSelectDateHandler = (date: Date) => void | Promise<void>;

interface TrainingCalenderProp {
  month: Date;
  selectDate: Date;
  today: Date;
  changeSelectDate: ChangeSelectDateHandler;
  activityColorsDateMap: ActivityColorsDateMap;
}

const DOW_DEFAULT_COLOR = '#AAA';
const TODAY_COLOR = '#EEFF00';
const dayOfWeeks = [
  { id: 0, label: '日', color: '#ff7070' },
  { id: 1, label: '月', color: DOW_DEFAULT_COLOR },
  { id: 2, label: '火', color: DOW_DEFAULT_COLOR },
  { id: 3, label: '水', color: DOW_DEFAULT_COLOR },
  { id: 4, label: '木', color: DOW_DEFAULT_COLOR },
  { id: 5, label: '金', color: DOW_DEFAULT_COLOR },
  { id: 6, label: '土', color: '#7070ff' },
];

const TrainingCalenderMonth = (prop: TrainingCalenderProp) => {
  const month = dayjs(prop.month);
  const firstDate = month.startOf('month');
  const dayOfFirstDate = firstDate.day();
  const calenderStart = firstDate.subtract(dayOfFirstDate, 'day');

  const showDays = new Array(7 * 6)
    .fill(0)
    .map((_, index) => calenderStart.add(index, 'day'));

  const today = dayjs(prop.today);
  const selectDate = dayjs(prop.selectDate);

  return (
    <Box width="100%" padding={'10px'}>
      <Grid container columns={14}>
        {dayOfWeeks.map(({ id, label, color }) => (
          <Grid item xs={2} key={id}>
            <Box
              display="flex"
              justifyContent="center"
              sx={{
                color: id === today.day() ? TODAY_COLOR : color,
                fontWeight: id === today.day() ? 'bold' : 'normal',
                fontSize: '0.4rem',
              }}
            >
              {label}
            </Box>
          </Grid>
        ))}
        {showDays.map((showDate) => (
          <Grid
            item
            xs={2}
            sx={{
              opacity: showDate.isSame(prop.month, 'month') ? '100%' : '40%',
              padding: '0 5px 5px',
              background: selectDate.isSame(showDate, 'day') ? 'grey' : 'none',
              borderRadius: '5px',
            }}
            onClick={() => prop.changeSelectDate(showDate.toDate())}
            key={showDate.format('YYYY-MM-DD')}
          >
            <Box
              display="flex"
              justifyContent="center"
              sx={{
                color: showDate.isSame(today, 'day') ? TODAY_COLOR : 'inherit',
                fontWeight: showDate.isSame(today, 'day') ? 'bold' : 'normal',
              }}
            >
              {showDate.format('D')}
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              overflow="hidden"
              sx={{ height: '0.5rem' }}
            >
              {prop.activityColorsDateMap[showDate.format('YYYY-MM-DD')]?.map(
                (color) => (
                  <TrainingMark color={color} size="0.5rem" key={color} />
                )
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrainingCalenderMonth;
