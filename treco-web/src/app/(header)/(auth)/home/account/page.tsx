import Link from 'next/link';

export default function AccountPage() {
  return (
    <div className="p-4">
      <Link href="/auth/signout">ログアウト</Link>
    </div>
  );
}
