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

import { deleteTrainingEventAction } from '../_actions/delete-training-event.action';

type Props = {
  trainingCategoryId: string;
  trainingEventId: string;
};
export function EventDelete({ trainingCategoryId, trainingEventId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  async function deleteTrainingEvent() {
    setIsProcessing(true);
    try {
      await deleteTrainingEventAction({ trainingCategoryId, trainingEventId });
    } finally {
      setIsProcessing(false);
    }
    setIsOpen(false);
  }

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button className="h-full" variant="destructive">
          <TrashIcon aria-hidden="true" className="h-12 w-14" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            本当にトレーニング種目を削除しますか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消せません。また、関連する以下のデータも一緒に削除されます。
            <span className="mt-8 block">・トレーニング記録</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>やめる</AlertDialogCancel>
          <AlertDialogAction
            disabled={isProcessing}
            onClick={deleteTrainingEvent}
          >
            トレーニング種目を削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
