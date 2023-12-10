'use client';

import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({ children }: PropsWithChildren) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>
      {pending ? <ReloadIcon className="animate-spin" /> : children}
    </Button>
  );
}
