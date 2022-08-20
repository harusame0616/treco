import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface Prop {
  children: ReactNode;
}
const SectionContainer = (prop: Prop) => {
  return (
    <Box marginTop="5px" marginBottom="15px">
      {prop.children}
    </Box>
  );
};

export default SectionContainer;
