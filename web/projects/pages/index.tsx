import { Box, Link } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import PrimaryButton from '../components/case/primary-button';
import PageContainer from '../components/container/page-container';
import { AuthContext, TitleContext } from './_app';

const Home: NextPage = () => {
  const auth = useContext(AuthContext);
  const { setTitle } = useContext(TitleContext);

  const signInAnonymously = async () => {
    await auth?.signInAnonymously();
  };

  useEffect(() => {
    setTitle?.('');
  }, []);

  return auth ? (
    <PageContainer>
      <main>
        <Box marginTop="-20px">
          <Image
            src="/media/splash.svg"
            width={500}
            height={500}
            layout="responsive"
            alt="TRECo Splash Image"
          />
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
              <PrimaryButton onClick={() => auth.siginInWith('google')}>
                Google で開始する
              </PrimaryButton>
            </Box>
            <Box display="flex" justifyContent="flex-end" marginRight="5px">
              <Link onClick={signInAnonymously}>登録せず開始する</Link>
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
            <Link href="/policies/term-of-service" sx={{ flexShrink: 0 }}>
              利用規約
            </Link>
            、
            <Link href="/policies/privacy" sx={{ flexShrink: 0 }}>
              プライバシーポリシー
            </Link>
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
