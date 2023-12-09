'use client';

import { utcDate } from '@/lib/date';
import React, { PropsWithChildren, memo, useCallback } from 'react';

type Props = PropsWithChildren<{
  active?: boolean;
  date: Date;
  highlight?: boolean;
  mute?: boolean;
  onSelectDate: (date: Date) => void;
}>;

export const Day = memo(function Day({
  active,
  children,
  date,
  highlight,
  mute,
  onSelectDate,
}: Props) {
  const localDate = utcDate(date).tz('Asia/Tokyo');

  const style = [
    'rounded-md h-12 transition flex flex-col px-1',
    highlight ? 'bg-muted-foreground' : '',
    mute ? 'opacity-40' : '',
    active ? 'font-black text-yellow-300' : '',
  ].join(' ');

  const onClickHandler = useCallback(() => {
    onSelectDate(date);
  }, [date, onSelectDate]);

  return (
    <button className={style} onClick={onClickHandler}>
      <div className="w-full">{localDate.format('D')}</div>
      <div className="w-full">{children}</div>
    </button>
  );
});
