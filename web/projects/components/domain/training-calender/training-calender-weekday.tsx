import { Box, Grid } from '@mui/material';
import { memo } from 'react';

interface Prop {
  weekday: Weekday;
  isActive: boolean;
}

export const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;
type Weekday = typeof WEEKDAYS[number];

const DOW_DEFAULT_COLOR = '#AAA';
const ACTIVE_COLOR = '#EEFF00';

const DAY_OF_WEEKS = [
  { label: '日', color: '#ff7070' },
  { label: '月', color: DOW_DEFAULT_COLOR },
  { label: '火', color: DOW_DEFAULT_COLOR },
  { label: '水', color: DOW_DEFAULT_COLOR },
  { label: '木', color: DOW_DEFAULT_COLOR },
  { label: '金', color: DOW_DEFAULT_COLOR },
  { label: '土', color: '#7070ff' },
];

const TrainingCalenderWeekday = memo(function _TrainingCalenderWeekday(
  prop: Prop
) {
  const weekday = DAY_OF_WEEKS[prop.weekday];

  const style = {
    fontSize: '0.4rem',
    ...(prop.isActive
      ? {
          color: ACTIVE_COLOR,
          fontWeight: 'bold',
        }
      : {
          color: weekday.color,
        }),
  };

  return (
    <Grid item xs={2}>
      <Box display="flex" justifyContent="center" sx={style}>
        {weekday.label}
      </Box>
    </Grid>
  );
});

export default TrainingCalenderWeekday;
