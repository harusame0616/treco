import { Facebook, Google, Twitter } from '@mui/icons-material';
import { Box } from '@mui/system';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CenteredProgress from '../../components/case/centered-progress';
import PrimaryButton from '../../components/case/primary-button';
import SecondaryButton from '../../components/case/secondary-button';
import TextButton from '../../components/case/text-button';
import PageContainer from '../../components/container/page-container';
import SectionContainer from '../../components/container/section-container';
import { PageInjection } from '../_app';

const SingoutConfirmPage: NextPage<PageInjection> = ({ auth, pageTitle }) => {
  const router = useRouter();

  useEffect(() => {
    pageTitle.clear();
  }, []);

  if (!auth.isAuthenticated) {
    return <CenteredProgress />;
  }

  const signOut = async () => {
    router.push('/auth/signout');
  };

  const cancel = () => {
    router.push('/home');
  };

  if (!auth.auth.isAnonymous) {
    return (
      <PageContainer>
        <SectionContainer>アカウント連携済みです。</SectionContainer>
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
            <Google sx={{ marginRight: '5px' }} /> Google と連携する
          </PrimaryButton>
          <PrimaryButton onClick={() => auth.linkWith('twitter')}>
            <Twitter sx={{ marginRight: '5px' }} /> Twitter と連携する
          </PrimaryButton>
          <PrimaryButton onClick={() => auth.linkWith('facebook')}>
            <Facebook sx={{ marginRight: '5px' }} /> Facebook と連携する
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

export default SingoutConfirmPage;
