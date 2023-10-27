'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Input as InputType,
  Output as OutputType,
  object,
  string,
} from 'valibot';
import { createTrainingEventAction } from './actions';

type Props = { trainingCategoryId: string };

const inputSchema = object({
  name: string(),
  valueUnit: string(),
  loadUnit: string(),
});
type InputSchema = typeof inputSchema;

export function EventEdit({ trainingCategoryId }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<InputType<InputSchema>>({
    defaultValues: {
      name: '',
      valueUnit: 'kg',
      loadUnit: '回',
    },
    resolver: valibotResolver(inputSchema),
  });

  const onClick = async ({
    name,
    valueUnit,
    loadUnit,
  }: OutputType<InputSchema>) => {
    await createTrainingEventAction({
      trainingCategoryId,
      name,
      valueUnit,
      loadUnit,
    });
    setOpen(false);
  };
  const title = 'トレーニングイベントを作成';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">トレーニング種目を作成する</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">名前</Label>
            <Input className="col-span-3" {...form.register('name')} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">負荷の単位</Label>
            <Input className="col-span-3" {...form.register('loadUnit')} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">値の単位</Label>
            <Input className="col-span-3" {...form.register('valueUnit')} />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={form.handleSubmit(onClick)}
            disabled={form.formState.isSubmitting}
          >
            保存する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
