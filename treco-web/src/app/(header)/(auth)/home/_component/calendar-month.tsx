"use client";
import dayjs from "dayjs";
import { memo } from "react";
import { Day } from "./day";

type Props = {
  year: number;
  month: number;
  selectDate: Date;
  onSelectDate: (date: Date) => void;
};

export function CalendarMonth({
  year,
  month,
  onSelectDate,
  selectDate,
}: Props) {
  const daysOfWeek = [
    {
      label: "日",
      color: "text-red-500",
    },
    { label: "月" },
    { label: "火" },
    { label: "水" },
    { label: "木" },
    { label: "金" },
    { label: "土", color: "text-blue-500" },
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
          key={day.label}
          className={`${day.color} text-xs text-center mb-1`}
        >
          {day.label}
        </div>
      ))}
      {days.map((day) => {
        return (
          <Day
            key={day.format("YYYY-MM-DD")}
            date={day.toDate()}
            mute={!day.isSame(firstDate, "month")}
            highlight={day.isSame(selectDate, "day")}
            active={dayjs().isSame(day, "day")}
            onSelectDate={onSelectDate}
          />
        );
      })}
    </div>
  );
}
