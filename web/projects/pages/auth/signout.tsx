import { NextPage } from 'next';
import CenteredProgress from '../../components/case/centered-progress';
import { PageInjection } from '../_app';

const SignoutPage: NextPage<PageInjection> = ({ auth }) => {
  if (!auth.isLoading) {
    auth.signOut();
  }

  return <CenteredProgress />;
};

export default SignoutPage;
