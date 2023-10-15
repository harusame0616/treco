import Link from 'next/link';
import { PropsWithChildren } from 'react';

export default function PoliciesLayout({ children }: PropsWithChildren) {
  return (
    <main className="h-full px-4 py-8 max-w-5xl mx-auto">
      {children}
      <nav className="text-center">
        <Link href="/">戻る</Link>
      </nav>
    </main>
  );
}
