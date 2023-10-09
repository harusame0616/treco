import Link from 'next/link';

export default function AccountPage() {
  return (
    <div>
      <Link href="/auth/signout">ログアウト</Link>
    </div>
  );
}
