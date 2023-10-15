'use client';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

export function CancelButton() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button
      onClick={() => router.push(pathname)}
      type="button"
      variant="secondary"
    >
      変更をキャンセルする
    </Button>
  );
}
