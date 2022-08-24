import { Box } from '@mui/system';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import CenteredProgress from '../../components/case/centered-progress';
import PrimaryButton from '../../components/case/primary-button';
import SecondaryButton from '../../components/case/secondary-button';
import TextButton from '../../components/case/text-button';
import PageContainer from '../../components/container/page-container';
import SectionContainer from '../../components/container/section-container';
import { CriticalError } from '../../custom-error/critical-error';
import { AuthContext, PopMessageContext } from '../_app';

const SignoutPage: NextPage = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const popMessage = useContext(PopMessageContext);

  if (!popMessage || !auth) {
    throw new CriticalError('Context error');
  }

  const signOut = async () => {
    await auth.signOut();
    popMessage('ログアウトに成功しました。');
    router.push('/');
  };

  const cancel = () => {
    router.push('/home');
  };

  if (!auth.isAuthenticated) {
    router.push('/');
    return <CenteredProgress />;
  }

  if (!auth.auth.isAnonymous) {
    return (
      <PageContainer>
        <SectionContainer>Google アカウントと連携済みです。</SectionContainer>
        <SectionContainer>
          <PrimaryButton onClick={signOut}>ログアウトを続ける</PrimaryButton>
        </SectionContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionContainer>
        <p>現在一時アカウントでサインインしています。</p>
        <p>
          サインアウトを続けるとトレーニング記録にアクセスできなくなります。
          <br />
          再度登録したトレーニング記録にアクセスするためには Google
          アカウントと連携してください。
          <br />
        </p>
      </SectionContainer>
      <SectionContainer>
        <Box
          display="flex"
          flexDirection="column"
          gap="10px"
          marginBottom="20px"
        >
          <SecondaryButton onClick={cancel}>
            サインアウトをキャンセルする
          </SecondaryButton>
          <PrimaryButton onClick={() => auth.linkWith('google')}>
            Googleアカウントと連携する
          </PrimaryButton>
        </Box>
      </SectionContainer>
      <SectionContainer>
        <Box
          display="flex"
          sx={{ fontSize: '0.7rem' }}
          flexDirection="column"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <TextButton onClick={signOut}>
            記録が失われることを理解してサインアウトする
          </TextButton>
        </Box>
      </SectionContainer>
    </PageContainer>
  );
};

export default SignoutPage;