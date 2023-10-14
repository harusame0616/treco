import { Card } from "@/components/ui/card";
import Link from "next/link";
import { PropsWithChildren } from "react";

export function PolicyContainer({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  return (
    <>
      <h1 className="text-2xl mb-8 text-center">{title}</h1>
      <Card className="overflow-y-scroll h-3/4 min-h-[400px] w-full whitespace-pre-wrap mb-8 p-4 ">
        {children}
      </Card>
    </>
  );
}
