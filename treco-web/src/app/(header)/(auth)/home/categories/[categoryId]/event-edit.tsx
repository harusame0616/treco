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
  loadUnit: string(),
  name: string(),
  valueUnit: string(),
});
type InputSchema = typeof inputSchema;

export function EventEdit({ trainingCategoryId }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<InputType<InputSchema>>({
    defaultValues: {
      loadUnit: '回',
      name: '',
      valueUnit: 'kg',
    },
    resolver: valibotResolver(inputSchema),
  });

  const onClick = async ({
    loadUnit,
    name,
    valueUnit,
  }: OutputType<InputSchema>) => {
    await createTrainingEventAction({
      loadUnit,
      name,
      trainingCategoryId,
      valueUnit,
    });
    setOpen(false);
  };
  const title = 'トレーニングイベントを作成';

  return (
    <Dialog onOpenChange={setOpen} open={open}>
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
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onClick)}
            type="button"
          >
            保存する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
