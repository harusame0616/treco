'use client';

import { TrainingMark } from '@/components/training-mark';
import { utcDate } from '@/lib/date';
import { PropsWithChildren, memo, useCallback } from 'react';

type TrainingMarksProps = {
  isSkeleton?: boolean;
  trainingMarkColors?: string[];
};
function TrainingMarks({
  isSkeleton = false,
  trainingMarkColors,
}: TrainingMarksProps) {
  return (
    <ul className="grid grid-cols-5 gap-y-1">
      {isSkeleton
        ? Array.from({ length: 4 }).map((_, index) => (
            <TrainingMark isSkeleton key={index} size="x-small" />
          ))
        : trainingMarkColors?.map((color) => (
            <TrainingMark color={color} key={color} size="x-small" />
          ))}
    </ul>
  );
}

type Props = PropsWithChildren<{
  active?: boolean;
  date: string;
  highlight?: boolean;
  isSkeleton?: boolean;
  mute?: boolean;
  onSelectDate: (date: Date) => void;
  trainingMarkColors?: string[];
}>;

export const Day = memo(function Day({
  active,
  date,
  highlight,
  isSkeleton = false,
  mute,
  onSelectDate,
  trainingMarkColors,
}: Props) {
  const localDate = utcDate(date).tz('Asia/Tokyo');

  const style = [
    'rounded-md h-12 transition flex flex-col px-1',
    highlight ? 'bg-muted-foreground' : '',
    mute ? 'opacity-40' : '',
    active ? 'font-black text-yellow-300' : '',
  ].join(' ');

  const onClickHandler = useCallback(() => {
    onSelectDate(new Date(date));
  }, [date, onSelectDate]);

  return (
    <button className={style} onClick={onClickHandler}>
      <div className="w-full">{localDate.format('D')}</div>
      <div className="w-full">
        <TrainingMarks
          isSkeleton={isSkeleton}
          trainingMarkColors={trainingMarkColors}
        />
      </div>
    </button>
  );
});
