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

import { deleteTrainingCategoryAction } from '../_actions/delete-training-category.action';

type Props = {
  trainingCategoryId: string;
};
export function CategoryDelete({ trainingCategoryId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  async function deleteTrainingCategory() {
    setIsProcessing(true);
    try {
      await deleteTrainingCategoryAction({ trainingCategoryId });
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
          <AlertDialogTitle>本当にカテゴリーを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消せません。また、関連する以下のデータも一緒に削除されます。
            <span className="block">・トレーニング種目</span>
            <span className="block">・トレーニング</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>やめる</AlertDialogCancel>
          <AlertDialogAction
            disabled={isProcessing}
            onClick={deleteTrainingCategory}
          >
            カテゴリーを削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
