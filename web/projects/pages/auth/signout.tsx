import CenteredProgress from '@Components/case/centered-progress';
import { NextPage } from 'next';
import { PageInjection } from '../_app';

const SignoutPage: NextPage<PageInjection> = ({ auth }) => {
  if (!auth.isLoading) {
    auth.signOut();
  }

  return <CenteredProgress />;
};

export default SignoutPage;
