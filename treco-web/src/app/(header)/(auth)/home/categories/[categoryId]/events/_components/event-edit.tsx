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
import { Pencil2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Input as InputType,
  Output as OutputType,
  object,
  string,
} from 'valibot';

import {
  createTrainingEventAction,
  editTrainingEventAction,
} from '../_actions';

type CreateProps = { trainingCategoryId: string };
type EditProps = {
  loadUnit: string;
  name: string;
  trainingCategoryId: string;
  trainingEventId: string;
  valueUnit: string;
};

type Props = CreateProps | EditProps;

const inputSchema = object({
  loadUnit: string(),
  name: string(),
  valueUnit: string(),
});
type InputSchema = typeof inputSchema;

export function EventEdit(props: Props) {
  const [open, setOpen] = useState(false);
  const isNew = !('trainingEventId' in props);

  const form = useForm<InputType<InputSchema>>({
    defaultValues: isNew
      ? {
          loadUnit: '回',
          name: '',
          valueUnit: 'kg',
        }
      : props,
    resolver: valibotResolver(inputSchema),
  });

  const onClick = async ({
    loadUnit,
    name,
    valueUnit,
  }: OutputType<InputSchema>) => {
    if (isNew) {
      await createTrainingEventAction({
        loadUnit,
        name,
        trainingCategoryId: props.trainingCategoryId,
        valueUnit,
      });
    } else {
      await editTrainingEventAction({
        loadUnit,
        name,
        trainingCategoryId: props.trainingCategoryId,
        trainingEventId: props.trainingEventId,
        valueUnit,
      });
    }
    setOpen(false);
  };

  const title = 'トレーニングイベントを作成';
  const trigger = isNew ? (
    <Button className="w-full">トレーニング種目を作成する</Button>
  ) : (
    <Button aria-label="トレーニング種目編集" type="button" variant="ghost">
      <Pencil2Icon aria-hidden="true" className="h-6 w-6" />
    </Button>
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" id="name">
              名前
            </Label>
            <Input
              className="col-span-3"
              {...form.register('name')}
              aria-labelledby="name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" id="loadUnit">
              負荷の単位
            </Label>
            <Input
              className="col-span-3"
              {...form.register('loadUnit')}
              aria-labelledby="loadUnit"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" id="valueUnit">
              値の単位
            </Label>
            <Input
              className="col-span-3"
              {...form.register('valueUnit')}
              aria-labelledby="valueUnit"
            />
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
