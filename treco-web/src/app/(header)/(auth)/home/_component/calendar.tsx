'use client';

import dayjs, { Dayjs } from 'dayjs';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { CalendarMonth } from './calendar-month';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const createViewMonths = (month: Dayjs, startIndex: number) => {
  // 0 は現在表示中の月、 1 は次の月、 -1 は前の月を表す。
  // 現在のスライドの位置が現在の表示中の月 (0)でその前後が、一ヶ月前、一ヶ月後になるようにする
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
export function Calendar() {
  const [selectDate, setSelectDate] = useState(dayjs());
  const [viewMonth, setViewMonth] = useState(dayjs());

  const [slideIndex, setSlideIndex] = useState(0);
  const router = useRouter();

  const months = createViewMonths(viewMonth, slideIndex);
  const selectDateHandler = useCallback(
    (date: Date) => {
      setSelectDate(dayjs(date));
      const searchParams = new URLSearchParams({
        date: dayjs(date).format('YYYY-MM-DD'),
      });
      router.push(`/home?${searchParams.toString()}`, {});
    },
    [router]
  );

  const afterChangeMemo = useCallback(
    (index: number) => {
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
      setViewMonth(viewMonth.add(num, 'month'));
    },
    [slideIndex, viewMonth]
  );

  return (
    <div className="w-full">
      <Slider
        infinite={true}
        dots={false}
        arrows={false}
        speed={200}
        afterChange={afterChangeMemo}
      >
        {months.map((month) => (
          <CalendarMonth
            selectDate={selectDate.toDate()}
            onSelectDate={selectDateHandler}
            year={month.year()}
            month={month.month() + 1}
            key={month.toISOString()}
          />
        ))}
      </Slider>
    </div>
  );
}
