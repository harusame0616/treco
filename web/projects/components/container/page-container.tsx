import { Box, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface PageContainerProp {
  children: ReactNode;
}
const PageContainer = (prop: PageContainerProp) => {
  const theme = useTheme();
  const background: any = theme.palette.background;

  return (
    <Box
      padding="20px"
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      sx={{ background: background.default, color: background.contrastText }}
    >
      {prop.children}
    </Box>
  );
};

export default PageContainer;
