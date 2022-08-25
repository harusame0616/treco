import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface Prop {
  children: ReactNode;
}
const ListContainer = (prop: Prop) => {
  return (
    <Box display="flex" flexDirection="column" gap="5px">
      {prop.children}
    </Box>
  );
};

export default ListContainer;
