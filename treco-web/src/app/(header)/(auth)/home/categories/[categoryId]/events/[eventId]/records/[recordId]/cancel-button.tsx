"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export function CancelButton({}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button
      variant="secondary"
      onClick={() => router.push(pathname)}
      type="button"
    >
      変更をキャンセルする
    </Button>
  );
}
