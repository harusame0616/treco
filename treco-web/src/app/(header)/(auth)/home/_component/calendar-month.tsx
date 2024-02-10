'use client';

import { TrainingRecordQueryTrainingMarksForCalendar } from '@/domains/training-record/usecases/query-training-marks-for-calendar.usecase';
import { utcDate } from '@/lib/date';
import { useMemo } from 'react';
import useSWR from 'swr';

import { Day } from './day';

type Props = {
  month: number;
  onSelectDate: (date: Date) => void;
  selectDate: Date;
  year: number;
};

export function CalendarMonth({
  month,
  onSelectDate,
  selectDate,
  year,
}: Props) {
  const daysOfWeek = [
    {
      color: 'text-red-500',
      label: '日',
    },
    { label: '月' },
    { label: '火' },
    { label: '水' },
    { label: '木' },
    { label: '金' },
    { color: 'text-blue-500', label: '土' },
  ];

  const firstDate = utcDate(`${year}-${month}-01`)
    .tz('Asia/Tokyo')
    .startOf('month');
  const dayOfFirstDate = firstDate.day();
  const calendarStart = firstDate.subtract(dayOfFirstDate, 'day');
  const days = new Array(7 * 6)
    .fill(0)
    .map((_, index) => calendarStart.add(index, 'day'));

  const apiUrl = '/api/query-training-marks-per-month-for-calendar';
  const searchParams = new URLSearchParams({
    end: days.at(-1)!.toISOString(),
    start: days.at(0)!.toISOString(),
  });

  const { data, isLoading } = useSWR<
    Awaited<ReturnType<TrainingRecordQueryTrainingMarksForCalendar['execute']>>
  >(`${apiUrl}?${searchParams.toString()}`, (url: string) =>
    fetch(url).then(async (data) => await data.json()),
  );

  // 日毎でグループ化し、更に同一カテゴリは統合する
  const trainingMarks = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(
          data
            ? data.reduce(
                (group, record) => {
                  const date = utcDate(record.trainingDate)
                    .tz('Asia/Tokyo')
                    .startOf('day')
                    .toISOString();
                  if (!group[date]) {
                    group[date] = {};
                  }
                  group[date][record.trainingCategoryId] = record;

                  return group;
                },
                {} as Record<string, Record<string, (typeof data)[number]>>,
              )
            : {},
        ).map(([date, marks]) => [
          date,
          Object.entries(marks).map(([_, mark]) => mark.color),
        ]),
      ),
    [data],
  );

  return (
    <div className="grid grid-cols-7 bg-muted">
      <div className="col-span-7 mb-1 text-center text-xs font-bold text-muted-foreground">
        {firstDate.format('YYYY 年 M 月')}
      </div>
      {daysOfWeek.map((day) => (
        <div
          className={`${day.color} mb-4 text-center text-xs font-bold`}
          key={day.label}
        >
          {day.label}
        </div>
      ))}
      {days.map((day) => {
        return (
          <Day
            active={utcDate().tz('Asia/Tokyo').isSame(day, 'day')}
            date={day.toDate().toISOString()}
            highlight={day.isSame(selectDate, 'day')}
            isSkeleton={isLoading}
            key={day.toISOString()}
            mute={!day.isSame(firstDate, 'month')}
            onSelectDate={onSelectDate}
            trainingMarkColors={trainingMarks[day.toISOString()]}
          />
        );
      })}
    </div>
  );
}
