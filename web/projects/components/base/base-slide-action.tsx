import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface Prop {
  children: ReactNode;
  action: ReactNode;
}

const BaseSlideAction = (prop: Prop) => {
  return (
    <Box
      sx={{
        scrollSnapType: 'x mandatory',
        overflowX: 'scroll',
        width: '100%',
        overflowWrap: 'nowrap',
        '&::-webkit-scrollbar': {
          height: 0,
          width: 0,
          display: 'none',
          '-webkit-appearance': 'none',
        },
      }}
      gap="10px"
      display="flex"
    >
      <Box
        sx={{
          scrollSnapAlign: 'start',
          minWidth: '100%',
        }}
      >
        {prop.children}
      </Box>
      <Box
        sx={{
          scrollSnapAlign: 'start',
          minWidth: '20%',
        }}
      >
        {prop.action}
      </Box>
    </Box>
  );
};

export default BaseSlideAction;
