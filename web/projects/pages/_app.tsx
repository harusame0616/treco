import { CssBaseline, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createContext, useEffect } from 'react';
import MainHeader from '../components/domain/main-header';
import useAuth from '../hooks/useAuth';
import useMyTheme from '../hooks/useMyTheme';
import '../styles/globals.css';

export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(
  null
);

function MyApp({ Component, pageProps }: AppProps) {
  const auth = useAuth();
  const router = useRouter();

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

  if (!auth.isLoading) {
    if (auth.isAuthenticated && router.pathname == '/') {
      router.push('/home');
    } else if (!auth.isAuthenticated && router.pathname != '/') {
      router.push('/');
    } else {
      // do nothing
    }
  }

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={auth}>
          <Box display="flex" flexDirection="column" sx={{ height: '100%' }}>
            <MainHeader height={headerHeight} />
            <Box paddingTop="65px" flexGrow="1" flexShrink="0">
              {auth.isLoading ? undefined : <Component {...pageProps} />}
            </Box>
          </Box>
        </AuthContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
