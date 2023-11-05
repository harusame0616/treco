'use client';

import { TrainingMark } from '@/components/training-mark';
import { TrainingRecordQueryTrainingMarksForCalendar } from '@/domains/training-record/usecases/query-training-marks-for-calendar.usecase';
import dayjs from 'dayjs';
import useSWR from 'swr';

import { Day } from './day';
import { getOrigin } from '@/lib/url';

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

  const firstDate = dayjs(`${year}-${month}-01`).startOf('month');
  const dayOfFirstDate = firstDate.day();
  const calendarStart = firstDate.subtract(dayOfFirstDate, 'day');
  const days = new Array(7 * 6)
    .fill(0)
    .map((_, index) => calendarStart.add(index, 'day'));

  console.log(getOrigin());
  const apiUrl = new URL(
    '/api/query-training-marks-per-month-for-calendar',
    getOrigin(),
  );
  apiUrl.searchParams.set('start', days.at(0)!.toISOString());
  apiUrl.searchParams.set('end', days.at(-1)!.toISOString());

  const { data, isLoading } = useSWR<
    Awaited<ReturnType<TrainingRecordQueryTrainingMarksForCalendar['execute']>>
  >(apiUrl.href, (url: string) =>
    fetch(url).then(async (data) => await data.json()),
  );

  // 日毎でグループ化し、更に同一カテゴリは統合する
  const trainingMarks = data
    ? data.reduce(
        (group, record) => {
          const date = dayjs(record.trainingDate).utc().toISOString();
          if (!group[date]) {
            group[date] = {};
          }
          group[date][record.trainingCategoryId] = record;

          return group;
        },
        {} as Record<string, Record<string, (typeof data)[number]>>,
      )
    : {};

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
            active={dayjs().isSame(day, 'day')}
            date={day.toDate()}
            highlight={day.isSame(selectDate, 'day')}
            key={day.format('YYYY-MM-DD')}
            mute={!day.isSame(firstDate, 'month')}
            onSelectDate={onSelectDate}
          >
            {
              <ul className="grid grid-cols-5 gap-y-1">
                {isLoading ? (
                  <>
                    <TrainingMark isSkeleton size="x-small" />
                    <TrainingMark isSkeleton size="x-small" />
                    <TrainingMark isSkeleton size="x-small" />
                    <TrainingMark isSkeleton size="x-small" />
                    <TrainingMark isSkeleton size="x-small" />
                    <TrainingMark isSkeleton size="x-small" />
                    <TrainingMark isSkeleton size="x-small" />
                  </>
                ) : (
                  Object.entries(
                    trainingMarks[day.utc().toISOString()] ?? {},
                  ).map(([_, mark]) => (
                    <ol
                      className="flex justify-center"
                      key={mark.trainingRecordId}
                      style={{ color: mark.color }}
                    >
                      <TrainingMark color={mark.color} size="x-small" />
                    </ol>
                  ))
                )}
              </ul>
            }
          </Day>
        );
      })}
    </div>
  );
}
