import CenteredProgress from '@Components/case/centered-progress';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { PageInjection } from '../_app';

const SignoutPage: NextPage<PageInjection> = ({ auth }) => {
  const router = useRouter();
  if (!auth.isLoading) {
    auth.signOut().then(() => {
      router.push('/');
    });
  }

  return <CenteredProgress />;
};

export default SignoutPage;
