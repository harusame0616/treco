'use client';

import { PropsWithChildren } from 'react';

import { createNewRecordAction } from '../_actions';

type Props = PropsWithChildren<{
  trainingDate: Date;
  trainingEventId: string;
}>;
export function NewRecordButton({
  children,
  trainingDate,
  trainingEventId,
}: Props) {
  return (
    <button
      className="w-full break-all p-4 text-left text-3xl text-foreground"
      onClick={() =>
        createNewRecordAction({
          trainingDate,
          trainingEventId,
        })
      }
    >
      {children}
    </button>
  );
}
