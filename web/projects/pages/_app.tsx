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
import '../styles/globals.css';

export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(
  null
);
export const PopMessageContext = createContext<
  ReturnType<typeof usePopMessage>['popMessage'] | null
>(null);

const categoryCommandUsecase = new CategoryCommandUsecase({
  categoryRepository: new FSCategoryRepository(),
  trainingEventRepository: new FSTrainigEventRepository(),
});
function MyApp({ Component, pageProps }: AppProps) {
  const auth = useAuth();
  const router = useRouter();
  const popMessage = usePopMessage();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.register('sw.js');
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
    if (auth.isLoading) {
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
  }, [auth.isLoading, auth.isAuthenticated]);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={auth}>
          <PopMessageContext.Provider value={popMessage.popMessage}>
            <Box display="flex" flexDirection="column" sx={{ height: '100%' }}>
              <MainHeader
                height={headerHeight}
                onMenuClick={openUserMenu}
                isAuthenticated={auth.isAuthenticated}
              />
              <Box paddingTop="65px" flexGrow="1" flexShrink="0">
                {auth.isLoading ? undefined : <Component {...pageProps} />}
              </Box>
              {auth.auth.isAnonymous == true ? (
                <Box
                  sx={{ background: '#888800', opacity: '80%' }}
                  width="100vw"
                  fontSize="0.75rem"
                  textAlign="center"
                  fontWeight="bold"
                  flexGrow={0}
                  flexShrink={0}
                  marginTop="-20px"
                >
                  一時アカウントでログインで利用中です。 <br />
                  データの損失を防ぐため、
                  <Link
                    onClick={() => auth.linkWith('google')}
                    sx={{ textShadow: '0 0 1px white', fontWeight: 'bold' }}
                  >
                    Google アカウントと連携
                  </Link>
                  してください。
                </Box>
              ) : undefined}
            </Box>
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
