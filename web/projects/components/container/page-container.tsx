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
      marginTop="65px"
      padding="20px 20px 20px"
      width="100%"
      display="flex"
      flexDirection="column"
      position="relative"
      sx={{ background: background.default, color: background.contrastText }}
      overflow="auto"
      flexGrow="1"
    >
      {prop.children}
    </Box>
  );
};

export default PageContainer;
