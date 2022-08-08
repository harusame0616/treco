import { CssBaseline, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import MainHeader from '../components/domain/main-header';
import useMyTheme from '../hooks/useMyTheme';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
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

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Box display="flex" flexDirection="column" sx={{ height: '100%' }}>
          <MainHeader height={headerHeight} />

          <Box paddingTop="65px" flexGrow="1" flexShrink="0">
            <Component {...pageProps} />
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
