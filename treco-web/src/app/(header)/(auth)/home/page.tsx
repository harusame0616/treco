import { auth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  return <div className="text-center">HOME</div>;
}
