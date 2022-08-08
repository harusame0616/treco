import { Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import TrainingCalenderMonth from './training-calender-month';

type ChangeViewMonthHandler = (date: Date) => void | Promise<void>;
type ChangeSelectDateHandler = (date: Date) => void | Promise<void>;

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
  month: Date;
  selectDate: Date;
  today: Date;
  changeSelectDate: ChangeSelectDateHandler;
  changeViewMonth: ChangeViewMonthHandler;
  activityColorsDateMap: ActivityColorsDateMap;
}

const TrainingCalender = (prop: TrainingCalenderProp) => {
  const [selectDate, setSelectDate] = useState(prop.selectDate);
  const [month, setMonth] = useState(dayjs(prop.month));
  const [slideIndex, setSlideIndex] = useState(0);
  const [months, setMonths] = useState(createViewMonths(month, slideIndex));
  const sliderRef = useRef<null | Slider>(null);

  const changeMonth = useCallback(
    (date: Dayjs) => {
      prop.changeViewMonth(date.toDate());
    },
    [prop]
  );

  useEffect(() => {
    setSelectDate(prop.selectDate);
  }, [prop.selectDate]);

  useEffect(() => {
    const month = dayjs(prop.month);
    setMonth(month);
    setMonths(createViewMonths(month, slideIndex));
  }, [prop.month]);

  return (
    <Box width="100%">
      <Slider
        infinite={true}
        dots={false}
        arrows={false}
        speed="50"
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
          changeMonth(month.add(num, 'month'));
        }}
        ref={sliderRef}
      >
        {months.map((month) => (
          <TrainingCalenderMonth
            selectDate={selectDate}
            month={month.toDate()}
            today={new Date()}
            activityColorsDateMap={prop.activityColorsDateMap}
            changeSelectDate={(date) => {
              prop.changeSelectDate(date);
            }}
            key={month.toISOString()}
          />
        ))}
      </Slider>
    </Box>
  );
};

export default TrainingCalender;
