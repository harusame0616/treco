'use client';

import dayjs from 'dayjs';
import { memo, useCallback } from 'react';

type Props = {
  active?: boolean;
  date: Date;
  highlight?: boolean;
  mute?: boolean;
  onSelectDate: (date: Date) => void;
};
export const Day = memo(function Day({
  active,
  date,
  highlight,
  mute,
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
