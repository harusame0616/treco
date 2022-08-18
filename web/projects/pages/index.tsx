import { Box, Link } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import PrimaryButton from '../components/case/primary-button';
import PageContainer from '../components/container/page-container';
import { AuthContext } from './_app';

const Home: NextPage = () => {
  const auth = useContext(AuthContext);
  const router = useRouter();

  const signInAnonymously = async () => {
    await auth?.signInAnonymously();
    await router.push('/home');
  };

  return auth ? (
    <PageContainer>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box marginTop="-20px">
          <Image
            src="/media/splash.png"
            width={500}
            height={500}
            layout="responsive"
          />
        </Box>

        <Box
          sx={{
            FontFace: "font-family: 'Zen Maru Gothic', sans-serif;",
            fontSize: '1.5rem',
          }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginBottom="80px"
        >
          <Box marginBottom="25px">あなたのワークアウトの傍に</Box>
          <Box>シンプルで心地いい記録体験を</Box>
        </Box>

        <Box display="flex" justifyContent="center">
          <Box sx={{ width: '250px' }}>
            <Box marginBottom="25px" display="flex" justifyContent="center">
              <PrimaryButton onClick={() => auth.siginInWith('google')}>
                Google で開始する
              </PrimaryButton>
            </Box>
            <Box display="flex" justifyContent="flex-end" marginRight="5px">
              <Link onClick={signInAnonymously}>登録せず開始する</Link>
            </Box>
          </Box>
        </Box>
      </main>
    </PageContainer>
  ) : (
    <div></div>
  );
};

export default Home;
