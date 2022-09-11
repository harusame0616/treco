import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface Prop {
  children: ReactNode;
  flexGrow?: number;
  center?: boolean;
}

const SectionContainer = (prop: Prop) => {
  let option: any = { display: 'flex', flexDirection: 'column' };

  if (prop.center) {
    option.alignItems = 'center';
  }
  option.flexGrow = prop.flexGrow;

  return (
    <Box marginTop="5px" marginBottom="15px" {...option}>
      {prop.children}
    </Box>
  );
};

export default SectionContainer;
