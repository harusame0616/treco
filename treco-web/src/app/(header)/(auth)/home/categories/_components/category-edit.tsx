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
  createTrainingCategoryAction,
  editTrainingCategoryAction,
} from '../_actions';

type CreateProps = Record<string, never>;

type EditProps = {
  color: string;
  name: string;
  trainingCategoryId: string;
};

type Props = CreateProps | EditProps;

const inputSchema = object({
  color: string(),
  name: string(),
});
type InputSchema = typeof inputSchema;

export function CategoryEdit(props: Props) {
  const [open, setOpen] = useState(false);
  const isNew = !('trainingCategoryId' in props);

  const form = useForm<InputType<InputSchema>>({
    defaultValues: {
      color: 'color' in props ? props.color : '',
      name: 'name' in props ? props.name : '',
    },
    resolver: valibotResolver(inputSchema),
  });

  const onClick = async ({ color, name }: OutputType<InputSchema>) => {
    if (isNew) {
      await createTrainingCategoryAction({
        color,
        name,
      });
    } else {
      await editTrainingCategoryAction({
        color,
        name,
        trainingCategoryId: props.trainingCategoryId,
      });
    }
    setOpen(false);
  };
  const title = 'トレーニングカテゴリ' + (isNew ? '作成' : '編集');
  const trigger = isNew ? (
    <Button className="w-full">トレーニングカテゴリーを作成する</Button>
  ) : (
    <Button variant="ghost">
      <Pencil2Icon aria-label="編集" className="h-6 w-6" />
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
            <Label className="text-right" id="color">
              カラー
            </Label>
            <Input
              className="col-span-3"
              {...form.register('color')}
              aria-labelledby="color"
              type="color"
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
