'use client';

import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>
      {pending ? <ReloadIcon className="animate-spin" /> : '追加'}
    </Button>
  );
}
