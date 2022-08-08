import { AppBar, Grid, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import MenuIconButton from '../case/menu-icon-button';

interface MainHeaderProp {
  height: string;
}

const MainHeader = (prop: MainHeaderProp) => {
  const theme = useTheme();
  const background: any = theme.palette.background;

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
          <Link href="/" passHref={true}>
            <Image src="/icon-512x512.png" width={45} height={45} />
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
          <MenuIconButton color={background.contrastText} />
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default MainHeader;
