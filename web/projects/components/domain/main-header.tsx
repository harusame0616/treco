import { AppBar, Grid, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { CriticalError } from '../../custom-error/critical-error';
import { AuthContext } from '../../pages/_app';
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

  if (!auth) {
    throw new CriticalError('context error');
  }

  return (
    <AppBar
      position="fixed"
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
          <Link href={auth.isAuthenticated ? '/home' : '/'} passHref={true}>
            <Image
              src="/icon-512x512.png"
              width={45}
              height={45}
              alt="Treco Service Icon"
            />
          </Link>
        </Grid>
        <Grid
          item
          xs={8}
          display="flex"
          justifyContent="center"
          alignItems="center"
        ></Grid>
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
