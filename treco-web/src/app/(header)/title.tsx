"use client";

import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";

export function Title() {
  const searchParams = useSearchParams();
  const selectDate = dayjs(searchParams.get("date") || new Date());

  return (
    <div className=" flex justify-center text-xl gap-1 font-bold">
      <div className="text-muted-foreground font-normal">
        {selectDate.format("YYYY年")}
      </div>
      <div className="font-bold text-primary">{selectDate.format("MM月")}</div>
      <div className="font-bold">{selectDate.format("DD日")}</div>
    </div>
  );
}
