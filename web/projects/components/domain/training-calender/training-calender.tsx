import { Box } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useCallback, useMemo, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import TrainingCalenderMonth from './training-calender-month';

type ChangeViewMonthHandler = (date: Date) => void | Promise<void>;
type ChangeSelectDateHandler = (date: Dayjs) => void | Promise<void>;

const createViewMonths = (month: Dayjs, startIndex: number) => {
  const monthOrders = [
    [0, 1, -1],
    [-1, 0, 1],
    [1, -1, 0],
  ][startIndex];

  if (monthOrders == null) {
    throw new RangeError('Not found monthOrders by startIndex');
  }

  return monthOrders.map((monthOrder) => month.add(monthOrder, 'month'));
};

export interface ActivityColorsDateMap {
  [date: string]: string[];
}

interface TrainingCalenderProp {
  month: Dayjs;
  selectDate: Dayjs;
  today: Dayjs;
  changeSelectDate: ChangeSelectDateHandler;
  changeViewMonth: ChangeViewMonthHandler;
  activityColorsDateMap: ActivityColorsDateMap;
}

const TrainingCalender = (prop: TrainingCalenderProp) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = useRef<null | Slider>(null);

  const months = useMemo(
    () => createViewMonths(prop.month, slideIndex),
    [prop.month]
  );

  const changeMonth = useCallback(
    (date: Dayjs) => {
      prop.changeViewMonth(date.toDate());
    },
    [prop]
  );

  return (
    <Box width="100%">
      <Slider
        infinite={true}
        dots={false}
        arrows={false}
        speed={200}
        afterChange={(index: number) => {
          let num;
          if (index == 0 && slideIndex == 2) {
            num = 1;
          } else if (index == 2 && slideIndex == 0) {
            num = -1;
          } else if (index == slideIndex) {
            num = 0;
          } else {
            num = index < slideIndex ? -1 : 1;
          }
          setSlideIndex(index);
          changeMonth(prop.month.add(num, 'month'));
        }}
        ref={sliderRef}
      >
        {months.map((month) => (
          <TrainingCalenderMonth
            selectDate={
              prop.selectDate.isSame(month, 'month')
                ? prop.selectDate
                : undefined
            }
            month={month}
            today={prop.today}
            activityColorsDateMap={prop.activityColorsDateMap}
            changeSelectDate={prop.changeSelectDate}
            key={month.toISOString()}
          />
        ))}
      </Slider>
    </Box>
  );
};

export default TrainingCalender;
