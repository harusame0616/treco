import BaseLink from '@Components/base/base-link';
import TextButton from '@Components/case/text-button';
import useProcessing from '@Hooks/useProcessing';
import { Facebook, Google, Twitter } from '@mui/icons-material';
import { Box } from '@mui/material';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import PrimaryButton from '../components/case/primary-button';
import PageContainer from '../components/container/page-container';
import { AuthContext, TitleContext } from './_app';

const Home: NextPage = () => {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const { setTitle } = useContext(TitleContext);
  const { isProcessing, startProcessing } = useProcessing();

  const signInAnonymously = async () => {
    await auth?.signInAnonymously();
    await router.push('/home');
  };

  useEffect(() => {
    setTitle?.('');
  }, []);

  return auth ? (
    <PageContainer>
      <main>
        <Box marginTop="-20px" display="flex" justifyContent="center">
          <Box maxWidth="500px" width="100%">
            <Image
              src="/media/splash.svg"
              width={500}
              height={500}
              layout="responsive"
              alt="TRECo Splash Image"
            />
          </Box>
        </Box>
        <Box
          sx={{
            fontSize: '1.25rem',
          }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginBottom="60px"
          gap="10px"
        >
          <Box>あなたのトレーニングを邪魔しない</Box>
          <Box>シンプルなトレーニング記録サービス</Box>
        </Box>

        <Box display="flex" justifyContent="center">
          <Box sx={{ width: '250px' }}>
            <Box marginBottom="5px" display="flex" justifyContent="center">
              <PrimaryButton
                disabled={isProcessing}
                onClick={() =>
                  startProcessing(() => auth.siginInWith('google'))
                }
              >
                <Google sx={{ marginRight: '5px' }} /> Google で開始する
              </PrimaryButton>
            </Box>
            <Box marginBottom="5px" display="flex" justifyContent="center">
              <PrimaryButton
                disabled={isProcessing}
                onClick={() =>
                  startProcessing(() => auth.siginInWith('twitter'))
                }
              >
                <Twitter sx={{ marginRight: '5px' }} /> Twitter で開始する
              </PrimaryButton>
            </Box>
            <Box marginBottom="5px" display="flex" justifyContent="center">
              <PrimaryButton
                disabled={isProcessing}
                onClick={() =>
                  startProcessing(() => auth.siginInWith('facebook'))
                }
              >
                <Facebook sx={{ marginRight: '5px' }} />
                Facebook で開始する
              </PrimaryButton>
            </Box>
            <Box display="flex" justifyContent="flex-end" marginRight="5px">
              <TextButton
                onClick={() => startProcessing(() => signInAnonymously())}
              >
                登録せず開始する
              </TextButton>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{ fontSize: '0.75rem', width: '100%' }}
          display="flex"
          justifyContent="center"
          paddingTop="30px"
        >
          <Box>
            <BaseLink href="/policies/term-of-service">利用規約</BaseLink>、
            <BaseLink href="/policies/privacy">プライバシーポリシー</BaseLink>
            に同意の上でご利用ください。
          </Box>
        </Box>
      </main>
    </PageContainer>
  ) : (
    <div></div>
  );
};

export default Home;
