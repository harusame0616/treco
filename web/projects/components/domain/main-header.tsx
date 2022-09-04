import BaseLink from '@Components/base/base-link';
import { AppBar, Box, Grid, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { CriticalError } from '../../custom-error/critical-error';
import { AuthContext, TitleContext } from '../../pages/_app';
import MenuIconButton from '../case/menu-icon-button';

interface MainHeaderProp {
  height: string;
  onMenuClick: () => void;
  isAuthenticated: boolean;
}

const MainHeader = (prop: MainHeaderProp) => {
  const theme = useTheme();
  const background: any = theme.palette.background;

  const auth = useContext(AuthContext);
  const { title, clickListener } = useContext(TitleContext);

  if (!auth) {
    throw new CriticalError('context error');
  }

  return (
    <AppBar
      sx={{ height: prop.height, background: background.dark, padding: '10px' }}
    >
      <Grid container height="100%">
        <Grid
          item
          xs={2}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
        >
          <BaseLink href={auth.isAuthenticated ? '/home' : '/'}>
            <Image
              src="/icon-512x512.png"
              width={45}
              height={45}
              alt="Treco Service Icon"
            />
          </BaseLink>
        </Grid>
        <Grid
          item
          xs={8}
          display="flex"
          justifyContent="center"
          alignItems="center"
          color="white"
          sx={{ fontSize: '1.5rem' }}
        >
          <Box onClick={clickListener}>{title}</Box>
        </Grid>
        <Grid
          item
          xs={2}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          {auth.isAuthenticated ? (
            <MenuIconButton
              color={background.contrastText}
              onClick={() => prop.onMenuClick()}
            />
          ) : null}
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default MainHeader;
