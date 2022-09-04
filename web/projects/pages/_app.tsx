import useProcessing from '@Hooks/useProcessing';
import {
  Alert,
  CssBaseline,
  Link,
  Snackbar,
  ThemeProvider,
} from '@mui/material';
import { Box } from '@mui/system';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import MainHeader from '../components/domain/main-header';
import UserMenu from '../components/domain/user/user-menu';
import { FSCategoryRepository } from '../contexts/record/infrastructure/repository/fs-category-repository';
import { FSTrainigEventRepository } from '../contexts/record/infrastructure/repository/fs-training-event-repository';
import { CategoryCommandUsecase } from '../contexts/record/usecases/category-command-usecase';
import useAuth from '../hooks/useAuth';
import useMyTheme from '../hooks/useMyTheme';
import usePopMessage from '../hooks/usePopMessage';
import useTitle from '../hooks/useTitle';
import '../styles/globals.css';

export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(
  null
);
export const PopMessageContext = createContext<
  ReturnType<typeof usePopMessage>['popMessage'] | null
>(null);

export const TitleContext = createContext<Partial<ReturnType<typeof useTitle>>>(
  {}
);

const categoryCommandUsecase = new CategoryCommandUsecase({
  categoryRepository: new FSCategoryRepository(),
  trainingEventRepository: new FSTrainigEventRepository(),
});
function MyApp({ Component, pageProps }: AppProps) {
  const auth = useAuth();
  const router = useRouter();
  const title = useTitle();
  const popMessage = usePopMessage();
  const { startProcessing } = useProcessing();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.register('/sw.js');
        console.log('SW registered');
      } catch (e) {
        console.log('SW faild');
      }
    }
  }, []);
  const theme = useMyTheme({ theme: 'dark' });
  const headerHeight = '65px';

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const openUserMenu = () => setUserMenuOpen(true);
  const closeUserMenu = () => setUserMenuOpen(false);

  useEffect(() => {
    closeUserMenu();
    if (auth.isLoading) {
      return;
    }

    // 規約ページはログイン、未ログインに関わらず表示可能
    if (/^\/policies\/.*/.test(router.pathname)) {
      return;
    }

    if (auth.auth.authId && router.pathname == '/') {
      categoryCommandUsecase
        .createDefaultCategories(auth.auth.authId)
        .catch((e) => {
          console.log({ e });
          // 既にカテゴリが作成済みの場合はエラーが返ってくるが何もしない
          /* do nothing*/
        });
      router.push('/home');
    } else if (!auth.isAuthenticated && router.pathname != '/') {
      router.push('/');
    } else {
      // do nothing
    }
  }, [auth.isLoading, auth.isAuthenticated, router.pathname]);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <title>TRECo - BESIDE YOUR WORKOUT -</title>
        <meta
          name="description"
          content="トレーニングをもっと楽しくする、シンプルなトレーニング記録サービス。"
        />
        <meta property="og:url" content="" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TRECo - BESIDE YOUR WORKOUT -" />
        <meta
          property="og:description"
          content="トレーニングをもっと楽しくする、シンプルなトレーニング記録サービス。"
        />
        <meta property="og:site_name" content="TRECo - BESIDE YOUR WORKOUT -" />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/treco-prd-public-resource/ogp-image.png"
        />
      </Head>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={auth}>
          <PopMessageContext.Provider value={popMessage.popMessage}>
            <TitleContext.Provider value={title}>
              <MainHeader
                height={headerHeight}
                onMenuClick={openUserMenu}
                isAuthenticated={auth.isAuthenticated}
              />
              <Box display="flex" flexDirection="column" height="100%">
                {auth.isLoading ? undefined : <Component {...pageProps} />}
                {router.pathname != '/' && auth.auth.isAnonymous == true ? (
                  <Box
                    sx={{ background: '#888800', opacity: '80%' }}
                    width="100vw"
                    fontSize="0.75rem"
                    textAlign="center"
                    fontWeight="bold"
                    flexShrink="0"
                    flexGrow="0"
                  >
                    一時アカウントでログインで利用中です。 <br />
                    データの損失を防ぐため、
                    <Box
                      component="span"
                      onClick={() =>
                        startProcessing(() => auth.linkWith('google'))
                      }
                      sx={{
                        textShadow: '0 0 1px white',
                        fontWeight: 'bold',
                        color: 'red',
                      }}
                    >
                      Google アカウントと連携
                    </Box>
                    してください。
                  </Box>
                ) : undefined}
              </Box>
            </TitleContext.Provider>
            <Snackbar
              open={popMessage.open}
              autoHideDuration={popMessage.option.duration}
              onClose={popMessage.closeMessage}
            >
              <Alert
                variant="filled"
                severity={popMessage.option.mode}
                sx={{ width: '100vw' }}
                onClose={popMessage.closeMessage}
              >
                {popMessage.message}
              </Alert>
            </Snackbar>
            <UserMenu open={userMenuOpen} onClose={closeUserMenu} />
          </PopMessageContext.Provider>
        </AuthContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
