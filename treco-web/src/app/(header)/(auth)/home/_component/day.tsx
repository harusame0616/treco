'use client';

import dayjs from 'dayjs';
import { memo, useCallback } from 'react';

type Props = {
  date: Date;
  highlight?: boolean;
  mute?: boolean;
  active?: boolean;
  onSelectDate: (date: Date) => void;
};
export const Day = memo(function Day({
  date,
  highlight,
  mute,
  active,
  onSelectDate,
}: Props) {
  const dateDayjs = dayjs(date);

  const style = [
    'text-center rounded-md h-10 transition',
    highlight ? 'bg-muted-foreground' : '',
    mute ? 'opacity-40' : '',
    active ? 'font-black text-yellow-300' : '',
  ].join(' ');

  const onClickHandler = useCallback(() => {
    onSelectDate(date);
  }, [date, onSelectDate]);

  return (
    <button onClick={onClickHandler}>
      <div className={style}>{dateDayjs.format('D')}</div>
    </button>
  );
});
