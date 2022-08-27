import { Box, Grid } from '@mui/material';
import { Dayjs } from 'dayjs';
import { memo } from 'react';
import TrainingMark from '../training-mark';

interface Prop {
  date: Dayjs;
  isSelected: boolean;
  isToday: boolean;
  isInMonth: boolean; // 先月末や来月頭などの日付も表示するので、今月の日付かどうか
  categoryColors: string[];
  onClick: (date: Dayjs) => void;
}

const LABEL_TODAY_STYLE = { color: '#EEFF00', fontWeight: 'bold' };
const LABEL_NORMAL_STYLE = {};
const BORDER_IN_MONTH_STYLE = { opacity: '100%' };
const BORDER_OUT_MONTH_STYLE = { opacity: '40%' };
const BORDER_SELECTED_STYLE = { background: 'grey' };

const TrainingCalenderDay = memo(function _TrainingCalenderDay(prop: Prop) {
  const labelStyle = prop.isToday ? LABEL_TODAY_STYLE : LABEL_NORMAL_STYLE;
  const borderStyle = {
    borderRadius: '5px',
    padding: '0 5px 5px',
    ...(prop.isInMonth ? BORDER_IN_MONTH_STYLE : BORDER_OUT_MONTH_STYLE),
    ...(prop.isSelected ? BORDER_SELECTED_STYLE : {}),
  };

  return (
    <Grid item xs={2} sx={borderStyle} onClick={() => prop.onClick(prop.date)}>
      <Box display="flex" justifyContent="center" sx={labelStyle}>
        {prop.date.format('D')}
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        overflow="hidden"
        sx={{ height: '0.5rem' }}
      >
        {prop.categoryColors?.map((color) => (
          <TrainingMark color={color} size="0.5rem" key={color} />
        ))}
      </Box>
    </Grid>
  );
});
export default TrainingCalenderDay;
