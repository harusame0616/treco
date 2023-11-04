import { Card } from '@/components/ui/card';
import { PropsWithChildren } from 'react';

export function PolicyContainer({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  return (
    <>
      <h1 className="mb-8 text-center text-2xl">{title}</h1>
      <Card className="mb-8 h-3/4 min-h-[400px] w-full overflow-y-auto whitespace-pre-wrap p-4 ">
        {children}
      </Card>
    </>
  );
}
