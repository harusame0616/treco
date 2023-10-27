import Link from 'next/link';
import { PropsWithChildren } from 'react';

export default function PoliciesLayout({ children }: PropsWithChildren) {
  return (
    <main className="mx-auto h-full max-w-5xl px-4 py-8">
      {children}
      <nav className="text-center">
        <Link href="/">戻る</Link>
      </nav>
    </main>
  );
}
