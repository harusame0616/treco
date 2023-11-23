import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'アカウント設定',
};

export default function AccountPage() {
  return (
    <div className="p-4">
      <Link href="/auth/signout">ログアウト</Link>
    </div>
  );
}
