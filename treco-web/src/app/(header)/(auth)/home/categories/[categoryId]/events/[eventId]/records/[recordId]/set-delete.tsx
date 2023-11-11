'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { deleteSetAction } from './actions/delete-set.action';

type Props = {
  trainingCategoryId: string;
  trainingEventId: string;
  trainingRecordId: string;
  trainingSetIndex: number;
};

export function SetDelete({
  trainingCategoryId,
  trainingEventId,
  trainingRecordId,
  trainingSetIndex,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  async function deleteTrainingEvent() {
    setIsProcessing(true);
    try {
      await deleteSetAction({
        trainingCategoryId,
        trainingEventId,
        trainingRecordId,
        trainingSetIndex,
      });
    } finally {
      setIsProcessing(false);
    }
    setIsOpen(false);
  }

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <span className="sr-only">削除</span>
          <TrashIcon aria-hidden="true" className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            本当にトレーニングセットを削除しますか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>やめる</AlertDialogCancel>
          <AlertDialogAction
            disabled={isProcessing}
            onClick={deleteTrainingEvent}
            type="button"
          >
            トレーニングセットを削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
