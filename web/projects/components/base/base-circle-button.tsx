import { Box, IconButton } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';

interface Prop {
  onClick: MouseEventHandler;
  children: ReactNode;
  disabled?: boolean;
}

const BaseCircleButton = (prop: Prop) => {
  return (
    <IconButton
      sx={{
        background: 'white',
        boxShadow: '1px 1px 4px black',
        '&:hover': { backgroundColor: '#ccc' },
        '&:disabled': { backgroundColor: '#333', opacity: '70%' },
        color: 'red',
        fontWeight: 'bold',
        opacity: prop.disabled ? '60%' : '100%',
      }}
      onClick={prop.onClick}
      disabled={prop.disabled}
    >
      {prop.children}
    </IconButton>
  );
};

export default BaseCircleButton;
