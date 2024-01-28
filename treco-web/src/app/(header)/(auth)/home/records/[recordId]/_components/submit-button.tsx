'use client';

import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({
  children,
  disabled,
}: PropsWithChildren<{ disabled?: boolean }>) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending || disabled}>
      {pending ? <ReloadIcon className="animate-spin" /> : children}
    </Button>
  );
}
