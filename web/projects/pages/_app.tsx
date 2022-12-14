import MainHeader from '@Components/domain/main-header';
import UserMenu from '@Components/domain/user/user-menu';
import useAuth from '@Hooks/useAuth';
import useMyTheme from '@Hooks/useMyTheme';
import usePopMessage from '@Hooks/usePopMessage';
import useProcessing from '@Hooks/useProcessing';
import useTitle from '@Hooks/useTitle';
import { Alert, CssBaseline, Snackbar, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';
import { FSCategoryRepository } from '@Repositories/fs-category-repository';
import { FSTrainigEventRepository } from '@Repositories/fs-training-event-repository';
import { CategoryCommandUsecase } from '@Usecases/category-command-usecase';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import '../styles/globals.css';

const defaultAuthContext = {
  isAuthenticated: false as const,
  isLoading: true as const,
  auth: { authId: undefined },
};
export const AuthContext = createContext<
  ReturnType<typeof useAuth> | typeof defaultAuthContext
>(defaultAuthContext);
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

export interface PageInjection {
  auth: ReturnType<typeof useAuth>;
  popMessage: ReturnType<typeof usePopMessage>;
  pageTitle: ReturnType<typeof useTitle>;
}

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

    // ???????????????????????????????????????????????????????????????????????????
    if (/^\/policies\/.*/.test(router.pathname)) {
      return;
    }

    if (auth.auth.authId && router.pathname == '/') {
      categoryCommandUsecase
        .createDefaultCategories(auth.auth.authId)
        .catch((e) => {
          // ??????????????????????????????????????????????????????????????????????????????????????????
          /* do nothing*/
        });
      router.push('/home');
    } else if (!auth.isAuthenticated && router.pathname != '/') {
      router.push('/');
    } else {
      // do nothing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isLoading, auth.isAuthenticated, router.pathname]);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <title>TRECo - BESIDE YOUR WORKOUT -</title>
        <meta
          name="description"
          content="??????????????????????????????????????????????????????????????????????????????????????????????????????"
        />
        <meta property="og:url" content="" />
        <meta property="og:type" content="website" />{' '}
        <meta property="og:title" content="TRECo - BESIDE YOUR WORKOUT -" />
        <meta
          property="og:description"
          content="??????????????????????????????????????????????????????????????????????????????????????????????????????"
        />
        <meta property="og:site_name" content="TRECo - BESIDE YOUR WORKOUT -" />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/treco-prd-public-resource/ogp-image.png"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8857110954304323"
          crossOrigin="anonymous"
        />
        <link rel="preload" as="image" href="/media/splash.svg" />
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
                {auth.isLoading ? undefined : (
                  <Component
                    {...pageProps}
                    popMessage={popMessage}
                    auth={auth}
                    pageTitle={title}
                  />
                )}
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
                    ????????????????????????????????????????????????????????? <br />
                    ????????????????????????????????????
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
                      Google ????????????????????????
                    </Box>
                    ?????????????????????
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
