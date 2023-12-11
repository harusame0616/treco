'use client';

import { Button } from '@/components/ui/button';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

type Props = {
  index: number;
};
export function EditButton({ index }: Props) {
  const router = useRouter();

  function edit() {
    const url = new URL(window.location.href);
    url.searchParams.set('edit', `${index}`);
    router.push(url.href);
  }

  return (
    <Button onClick={edit} size="icon" type="button" variant="outline">
      <span className="sr-only">編集</span>
      <Pencil2Icon />
    </Button>
  );
}
