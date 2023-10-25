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
import { createCategoryAction, editCategoryAction } from '../actions';

type CreateProps = {};

type EditProps = {
  trainingCategoryId: string;
  color: string;
  name: string;
};

type Props = CreateProps | EditProps;

const inputSchema = object({
  name: string(),
  color: string(),
});
type InputSchema = typeof inputSchema;

export function CategoryEdit(props: Props) {
  const [open, setOpen] = useState(false);
  const isNew = !('trainingCategoryId' in props);

  const form = useForm<InputType<InputSchema>>({
    defaultValues: {
      name: 'name' in props ? props.name : '',
      color: 'color' in props ? props.color : '',
    },
    resolver: valibotResolver(inputSchema),
  });

  const onClick = async ({ name, color }: OutputType<InputSchema>) => {
    if (isNew) {
      await createCategoryAction({
        name,
        color,
      });
    } else {
      await editCategoryAction({
        trainingCategoryId: props.trainingCategoryId,
        name,
        color,
      });
    }
    setOpen(false);
  };
  const title = 'トレーニングカテゴリ' + (isNew ? '作成' : '編集');
  const trigger = isNew ? (
    <Button className="w-full">トレーニングカテゴリを作成する</Button>
  ) : (
    <Pencil2Icon className="w-6 h-6" />
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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
            <Label className="text-right">カラー</Label>
            <Input
              className="col-span-3"
              {...form.register('color')}
              type="color"
            />
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
