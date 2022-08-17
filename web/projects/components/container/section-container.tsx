import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface Prop {
  children: ReactNode;
}
const SectionContainer = (prop: Prop) => {
  return <Box marginBottom="30px">{prop.children}</Box>;
};

export default SectionContainer;
