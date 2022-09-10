import { NextPage } from 'next';
import { useContext } from 'react';
import CenteredProgress from '../../components/case/centered-progress';
import { AuthContext } from '../_app';

const SignoutPage: NextPage = () => {
  const auth = useContext(AuthContext);

  if (!auth.isLoading) {
    auth.signOut();
  }

  return <CenteredProgress />;
};

export default SignoutPage;
