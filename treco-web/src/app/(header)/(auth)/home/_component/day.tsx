'use client';

import dayjs from 'dayjs';
import React, { ReactNode, memo, useCallback } from 'react';

type Props = {
  active?: boolean;
  children: ReactNode;
  date: Date;
  highlight?: boolean;
  mute?: boolean;
  onSelectDate: (date: Date) => void;
};
export const Day = memo(function Day({
  active,
  children,
  date,
  highlight,
  mute,
  onSelectDate,
}: Props) {
  const dateDayjs = dayjs(date);

  const style = [
    'rounded-md h-14 transition flex flex-col px-1',
    highlight ? 'bg-muted-foreground' : '',
    mute ? 'opacity-40' : '',
    active ? 'font-black text-yellow-300' : '',
  ].join(' ');

  const onClickHandler = useCallback(() => {
    onSelectDate(date);
  }, [date, onSelectDate]);

  return (
    <button className={style} onClick={onClickHandler}>
      <div className="w-full">{dateDayjs.format('D')}</div>
      <div className="w-full">{children}</div>
    </button>
  );
});
