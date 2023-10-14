"use client";
import dayjs from "dayjs";
import { memo } from "react";

import { Day } from "./day";

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
      color: "text-red-500",
      label: "日",
    },
    { label: "月" },
    { label: "火" },
    { label: "水" },
    { label: "木" },
    { label: "金" },
    { color: "text-blue-500", label: "土" },
  ];

  const firstDate = dayjs(`${year}-${month}-01`).startOf("month");
  const dayOfFirstDate = firstDate.day();
  const calenderStart = firstDate.subtract(dayOfFirstDate, "day");
  const days = new Array(7 * 6)
    .fill(0)
    .map((_, index) => calenderStart.add(index, "day"));

  return (
    <div className="bg-muted grid grid-cols-7">
      {daysOfWeek.map((day) => (
        <div
          className={`${day.color} text-xs text-center mb-1`}
          key={day.label}
        >
          {day.label}
        </div>
      ))}
      {days.map((day) => {
        return (
          <Day
            active={dayjs().isSame(day, "day")}
            date={day.toDate()}
            highlight={day.isSame(selectDate, "day")}
            key={day.format("YYYY-MM-DD")}
            mute={!day.isSame(firstDate, "month")}
            onSelectDate={onSelectDate}
          />
        );
      })}
    </div>
  );
}
