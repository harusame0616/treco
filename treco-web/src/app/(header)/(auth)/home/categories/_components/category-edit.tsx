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
import { editCategoryAction } from '../actions';

type Props = {
  trainingCategoryId: string;
  color: string;
  name: string;
};

const inputSchema = object({
  name: string(),
  color: string(),
});
type InputSchema = typeof inputSchema;

export function CategoryEdit({ trainingCategoryId, color, name }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<InputType<InputSchema>>({
    defaultValues: {
      name: name,
      color,
    },
    resolver: valibotResolver(inputSchema),
  });

  const onClick = async (props: OutputType<InputSchema>) => {
    await editCategoryAction({
      trainingCategoryId,
      name: props.name,
      color: props.color,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil2Icon className="w-6 h-6" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>カテゴリ名編集</DialogTitle>
        </DialogHeader>
        <div>
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
