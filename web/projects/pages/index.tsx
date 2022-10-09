import BaseLink from '@Components/base/base-link';
import CenteredProgress from '@Components/case/centered-progress';
import PrimaryButton from '@Components/case/primary-button';
import TextButton from '@Components/case/text-button';
import PageContainer from '@Components/container/page-container';
import { OAuthProviderName } from '@Hooks/useAuth';
import useProcessing from '@Hooks/useProcessing';
import { Facebook, Google, Twitter } from '@mui/icons-material';
import { Box } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { PageInjection } from './_app';

type ProviderSettings = [OAuthProviderName, ReactNode];
const providers: ProviderSettings[] = [
  ['google', <Google key="google" />],
  ['twitter', <Twitter key="twitter" />],
  ['facebook', <Facebook key="facebook" />],
];

const Home: NextPage<PageInjection> = ({ auth, pageTitle }) => {
  const router = useRouter();
  const { isProcessing, startProcessing } = useProcessing();

  useEffect(() => {
    pageTitle.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (auth.isLoading) {
    return <CenteredProgress />;
  }

  const signInAnonymously = async () => {
    await startProcessing(async () => {
      await auth.signInAnonymously();
      await router.push('/home');
    });
  };

  const signInWith = async (provider: OAuthProviderName) => {
    await startProcessing(async () => {
      await auth.siginInWith(provider);
      await router.push('/home');
    });
  };

  return (
    <PageContainer>
      <Head>
        <link rel="preload" href="/media/splash.svg" as="image"></link>
      </Head>
      <main>
        <Box marginTop="-40px" display="flex" justifyContent="center">
          <Box maxWidth="500px" width="100%" marginTop="-2%" marginBottom="-2%">
            <Image
              src="/media/splash.svg"
              width={500}
              height={500}
              layout="responsive"
              alt="TRECo Splash Image"
              priority={true}
              loading="eager"
            />
          </Box>
        </Box>
        <Box
          sx={{
            fontSize: 'min(5vw, 28px)',
          }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginBottom="40px"
          gap="8px"
        >
          <Box>トレーニングをもっと楽しくする</Box>
          <Box>シンプルなトレーニング記録サービス</Box>
        </Box>

        <Box display="flex" justifyContent="center">
          <Box sx={{ width: '250px' }}>
            {providers.map(([providerName, providerIcon]) => (
              <Box
                marginBottom="5px"
                display="flex"
                justifyContent="center"
                key={providerName}
              >
                <PrimaryButton
                  disabled={isProcessing}
                  onClick={() => signInWith(providerName)}
                >
                  {providerIcon}{' '}
                  <Box marginLeft="5px">{providerName} で開始する</Box>
                </PrimaryButton>
              </Box>
            ))}
            <Box
              display="flex"
              justifyContent="flex-end"
              marginRight="5px"
              className="sign-in-anonymously-button-container"
            >
              <TextButton onClick={signInAnonymously}>
                登録せず開始する
              </TextButton>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{ fontSize: '0.7rem', width: '100%' }}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box marginBottom="20px">
            <BaseLink href="/policies/term-of-service">利用規約</BaseLink>、
            <BaseLink href="/policies/privacy-policy">
              プライバシーポリシー
            </BaseLink>
            に同意の上ご利用ください。
          </Box>
          <Box textAlign={'center'} marginBottom="5px">
            本サービスはモバイル端末向けに最適化されています。
            <br />
            以下のQRコードからモバイル端末でご利用ください。
          </Box>
          <Box width="min(50px, 80%)">
            <Image
              src="/qr.png"
              width="208"
              height="208"
              layout="responsive"
              alt="TRECo URL QR Code"
            />
          </Box>
        </Box>
      </main>
    </PageContainer>
  );
};

export default Home;
